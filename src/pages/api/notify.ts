import { DepositStatus, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers && req.headers.Authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  const prisma = new PrismaClient();
  const resend = new Resend(process.env.RESEND_API_KEY);

  const users = await prisma.user.findMany({
    include: {
      deposits: true
    }
  });

  for (const user of users) {
    const emailText = user.deposits.reduce((acc, deposit) => {
      return `${acc}${deposit.series} ${deposit.number} - ${deposit.status === DepositStatus.Won ? 'Nyert' : 'Nem nyert'}\n`;
    }, '');

    const emailResponse = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: [user.email!],
      subject: 'OTP Gépkocsinyeremény betét státusz összesítő',
      text: emailText,
    });

    if (emailResponse.error) {
      console.error(emailResponse.error);
      res.status(500).json({ ...emailResponse.error });
    }
  }

  res.status(200).json({});
}