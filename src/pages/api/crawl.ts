import type { NextApiRequest, NextApiResponse } from 'next';
import { DepositStatus, NotificationStatus, PrismaClient } from '@prisma/client';
import { JSDOM } from 'jsdom';
import { replaceParams, winnerDepositEmailHtml } from '../../utils/emails';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

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
  const winnerListItems = dom.window.document.querySelectorAll('#mtxt_sorsolasi__container li');
  const extraWinnerListItems = dom.window.document.querySelectorAll('#mtxt__container li') ?? [];

  if (!winnerListItems) {
    return res.status(500).json({ error: 'Could not find the "#mtxt_sorsolasi__container li"' });
  }

  // const winnerListItems = [
  //   '65 2065207 Suzuki Vitara 1,4 hybrid GL',
  //   '11 0428787 Toyota Corolla 1,5 sedan Comfort',
  //   '45 2342345 Toyota Corolla 1,5 sedan Comfort'
  // ];
  const prisma = new PrismaClient();
  for (const item of [...winnerListItems, ...extraWinnerListItems]) {
    const split = (item.textContent ?? '').split(' ');
    // const split = item.split(' ');
    const series = split[0] ?? '';
    const number = split[1] ?? '';

    if (series.length !== 2 || number.length !== 7) {
      return res.status(500).json({ error: ':(' });
    }

    const deposit = await prisma.deposit.findFirst({
      where: { series, number, status: DepositStatus.Pending, notificationStatus: NotificationStatus.None },
      include: { user: true }
    });
    if (!deposit) {
      console.log('LOSE', series, number);
      continue;
    }

    console.log('WIN', series, number, process.env.ELASTICEMAIL_API_KEY);

    const url = new URL('https://api.elasticemail.com/v2/email/send');
    url.searchParams.set('apikey', process.env.ELASTICEMAIL_API_KEY!);
    url.searchParams.set('from', process.env.FROM_EMAIL!);
    url.searchParams.set('to', deposit.user.email!);
    url.searchParams.set('subject', 'Az OTP Gépkocsinyeremény betéted NYERT');
    url.searchParams.set('bodyHtml', replaceParams(winnerDepositEmailHtml, { series, number }));
    const emailRes = await axios.post(url.toString());
    if (emailRes.data.success) {
      await prisma.deposit.update({
        where: { id: deposit.id },
        data: { status: DepositStatus.Won, notificationStatus: NotificationStatus.Sent }
      });
    } else {
      res.status(500).json({ error: emailRes.data.error });
    }
  }

  res.status(200).json({});
}