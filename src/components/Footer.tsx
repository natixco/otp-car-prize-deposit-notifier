export default function Footer() {
  return (
    <footer className="py-6 bg-zinc-900 w-full">
      <div className="main-container flex flex-row items-center justify-center">
        <p className="font-semibold text-zinc-200 text-center leading-6">
          Az oldal semmilyen jogi kapcsolatban nem áll az OTP bankkal.
          <br/>
          Csak a nyertes betétekről küld emailt az oldal.
          <br/>
          A teljes forráskód <a href="https://github.com/natixco/otp-car-prize-deposit-notifier" className="underline hover:text-lime-500">GitHub-on</a> megtalálható.
        </p>
      </div>
    </footer>
  );
}