import { JSDOM } from 'jsdom';
import type { NextApiRequest, NextApiResponse } from 'next';
import { deposits } from '../../server/db/db-schema';
import { db } from '../../server/db/db';
import { eq } from 'drizzle-orm';

const selectors = {
  winnerListItems: '#mtxt_sorsolasi__container li',
  extraWinnerListItems: '#mtxt__container li'
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  let otpTextContent = '';
  try {
    const otpRes = await fetch('https://www.otpbank.hu/portal/hu/Megtakaritas/ForintBetetek/Gepkocsinyeremeny', {
      method: 'GET'
    });
    otpTextContent = await otpRes.text();
  } catch (error) {
    return res.status(500).json({ error });
  }

  const dom = new JSDOM(otpTextContent);
  const winnerListItems = dom.window.document.querySelectorAll(selectors.winnerListItems);
  const extraWinnerListItems = dom.window.document.querySelectorAll(selectors.extraWinnerListItems) ?? [];
  if (!winnerListItems) {
    const error = `Could not find "${selectors.winnerListItems}"`;
    console.error(error);
    return res.status(500).json({ error });
  }

  const users = await db.query.users.findMany({
    with: {
      deposits: true
    }
  });

  const winnerDeposits = [...winnerListItems, ...extraWinnerListItems].map(item => {
    const textContent = item.textContent;
    if (!textContent) {
      return null;
    }

    const split = textContent.split(' ');
    const series = split[0] ?? '';
    const number = split[1] ?? '';
    return { series, number };
  });
  if (winnerDeposits.some(winnerDeposit => !winnerDeposit)) {
    const error = 'Could not find the text content of a winner list item';
    console.error(error);
    res.status(500).json({ error });
    return;
  }

  for (const user of users) {
    for (const deposit of user.deposits) {
      const status = winnerDeposits.some(winnerDeposit => winnerDeposit!.series === deposit.series && winnerDeposit!.number === deposit.number)
        ? 'won'
        : 'pending';
      await db
        .update(deposits)
        .set({ status })
        .where(eq(deposits.id, deposit.id));
    }
  }

  res.status(200).json({});
}