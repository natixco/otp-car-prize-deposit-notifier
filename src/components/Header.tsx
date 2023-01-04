import { signOut, useSession } from "next-auth/react";
import Button from "./Button";
import { openPopupWindow } from "../helpers";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header>
      <div className="main-container flex flex-row items-center justify-between py-6">
        <h1 className="text-lg font-bold">OTP Gépkocsinyeremény-betét sorsolás értesítő</h1>
        {session ? <Button label="Kijelentkezés" onClick={() => signOut()} />
          : <Button label="Bejelentkezés" onClick={() => openPopupWindow("/google-signin", "Sample Sign In")} />}
      </div>
    </header>
  );
}