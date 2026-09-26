import type { Metadata } from "next";
import LoginFormClient from "./LoginFormClient";

export const metadata: Metadata = {
  title: "Masuk | Kampung Budaya Polowijen",
  description:
    "Login ke portal Kampung Budaya Polowijen — jelajahi kekayaan budaya, temukan cerita di balik setiap karya, dan dukung UMKM lokal Malang.",
  openGraph: {
    title: "Masuk | Kampung Budaya Polowijen",
    description:
      "Jelajahi kekayaan budaya dan dukung UMKM lokal Malang. Masuk ke portal Kampung Budaya Polowijen.",
    images: [{ url: "/bg-polowijen.jpg" }],
  },
};

export default function LoginPage() {
  return (
    <main
      id="login-page"
      className="relative min-h-screen w-full overflow-hidden bg-[#4A2920]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('/images/login.jpg')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(155,61,50,0.74)_0%,rgba(155,61,50,0.42)_14%,rgba(155,61,50,0.18)_26%,rgba(74,41,32,0.7)_62%,rgba(74,41,32,1)_100%)]"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6">
        <div className="w-full max-w-[420px]">
          <LoginFormClient />
        </div>
      </div>
    </main>
  );
}
