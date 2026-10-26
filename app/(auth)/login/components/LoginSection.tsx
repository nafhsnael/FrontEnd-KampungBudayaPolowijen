import Image from "next/image";
import LoginFormClient from "./LoginFormClient";

export default function LoginSection() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#4A2920] px-5 py-10 max-[760px]:items-start">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/login.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(155,58,50,0.7)_0%,rgba(74,42,30,0.95)_100%)]" />
      </div>
      <div className="relative z-10 w-full max-w-131.25">
        <LoginFormClient />
      </div>
    </main>
  );
}
