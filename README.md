# otp-car-prize-deposit-notifier

Built with the T3 stack (next, nextAuth, prisma, tailwind, trpc).  

The site enables users to sign-in via Google and add their deposit numbers which will be checked against the winner numbers on [OTP's site](https://www.otpbank.hu/portal/hu/Megtakaritas/ForintBetetek/Gepkocsinyeremeny) every month, then it'll send an email to the user whose number won. 

### Project setup
`npm install`

### Run in development mode
`npm run dev`

### Build and run for production
`npm run build && npm start`

### Run database migrations
You can find the docs of it [here](https://www.prisma.io/docs/concepts/components/prisma-migrate)