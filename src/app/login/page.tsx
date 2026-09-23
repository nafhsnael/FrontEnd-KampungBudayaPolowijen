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
      className="relative min-h-screen w-full overflow-hidden bg-[#1f0d0a]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-polowijen.jpg')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(62,28,20,0.38),rgba(12,8,8,0.82))]"
        aria-hidden="true"
      />

      <div className="absolute inset-0 opacity-90" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,188,92,0.18)_0%,rgba(255,188,92,0)_22%,rgba(255,188,92,0)_78%,rgba(255,188,92,0.16)_100%)]" />
        <div className="absolute inset-y-0 left-0 w-16 bg-[repeating-linear-gradient(90deg,rgba(255,220,166,0.12)_0,rgba(255,220,166,0.12)_2px,transparent_2px,transparent_20px)]" />
        <div className="absolute inset-y-0 right-0 w-16 bg-[repeating-linear-gradient(90deg,rgba(255,220,166,0.12)_0,rgba(255,220,166,0.12)_2px,transparent_2px,transparent_20px)]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="relative w-full max-w-[410px] rounded-[38px] border-[10px] border-[#180e0d] bg-[#2b140f]/90 p-[2px] shadow-[0_40px_80px_rgba(0,0,0,0.7)]">
          <div className="absolute inset-x-3 top-3 h-6 rounded-full bg-[#1a0f0d]/80" />
          <div className="overflow-hidden rounded-[30px] bg-[#2b140f]/75 backdrop-blur-[1px]">
            <LoginFormClient />
          </div>
        </div>
      </div>
    </main>
  );
}
