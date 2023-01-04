import { NextApiRequest, NextApiResponse } from 'next';
import { NotificationStatus, PrismaClient } from '@prisma/client';

export const config = {

}

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

  if (!winnerListItems) {
    return res.status(500).json({ error: 'Could\'nt find the "#mtxt_sorsolasi__container li"' });
  }

  // const winnerListItems = [
  //   '65 2065207 Suzuki Vitara 1,4 hybrid GL',
  //   '65 2459032 Toyota Corolla 1,5 sedan Comfort',
  //   '65 0428787 Toyota Corolla 1,5 sedan Comfort'
  // ];
  const prisma = new PrismaClient();
  for (const item of [...winnerListItems]) {
    const split = item.textContent.split(' ');
    const series = split[0] ?? '';
    const number = split[1] ?? '';

    if (series.length !== 2 || number.length !== 7) {
      return res.status(500).json({ error: ':(' });
    }

    const deposit = await prisma.deposit.findFirst({
      where: { series, number, notificationStatus: NotificationStatus.None },
      include: { user: true },
    });
    if (!deposit) {
      continue;
    }

    // TODO queue emails
    await prisma.deposit.update({
      where: { id: deposit.id },
      data: { notificationStatus: NotificationStatus.Queued },
    });

  }

  res.status(200).json({});
}