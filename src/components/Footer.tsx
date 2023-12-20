export default function Footer() {
  return (
    <footer className="py-8 bg-zinc-900 w-full">
      <div className="main-container flex flex-row items-center justify-center">
        <p className="font-semibold text-zinc-200 text-center leading-6">
          Az oldal nem áll semmilyen kapcsolatban az OTP bankkal.
          A teljes forráskód <a href="https://github.com/natixco/otp-car-prize-deposit-notifier" className="underline hover:text-lime-500">GitHub-on</a> megtalálható.
        </p>
      </div>
    </footer>
  );
}