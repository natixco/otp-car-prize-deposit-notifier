import { signIn, signOut, useSession } from 'next-auth/react';
import Button from './Button';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="mb-6">
      <div className="main-container flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 py-6">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold">OTP Gépkocsinyeremény-betét sorsolás értesítő</h1>
          <p className="text-sm font-medium text-zinc-500">{session?.user?.email}</p>
        </div>
        {session
          ? <Button label="Kijelentkezés"
                    theme="secondary"
                    onClick={() => signOut({ callbackUrl: window.location.origin })} />
          : <Button label="Bejelentkezés"
                    theme="secondary"
                    onClick={() => signIn('google')} />}
      </div>
    </header>
  );
}