import { DepositStatus, PrismaClient } from '@prisma/client';
import { JSDOM } from 'jsdom';
import type { NextApiRequest, NextApiResponse } from 'next';

const selectors = {
  winnerListItems: '#mtxt_sorsolasi__container li',
  extraWinnerListItems: '#mtxt__container li'
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers && req.headers.Authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  const prisma = new PrismaClient();

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

  const users = await prisma.user.findMany({
    include: {
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
        ? DepositStatus.Won
        : DepositStatus.Pending;
      await prisma.deposit.update({
        where: {
          id: deposit.id,
        },
        data: {
          status,
        }
      });
    }
  }

  res.status(200).json({});
}