"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut } from "lucide-react";
import { clearAuthSession, getAuthSession } from "@/lib/auth/session";
import { logout } from "@/services/auth";

export default function AdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getAuthSession();
    if (session) {
      void logout(session.accessToken);
    }
    clearAuthSession();
    router.replace("/admin/login");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FBF3DF] px-4 text-center">
      <section className="w-full max-w-[330px] rounded-2xl bg-[#FFFDF8] px-6 py-7 shadow-[0_8px_24px_rgba(74,41,31,.16)]">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#FCE9E8] text-[#D95050]">
          <LogOut size={17} aria-hidden="true" />
        </span>
        <h1 className="mt-3 text-[15px] font-bold text-[#4A342A]">
          Sedang Keluar
        </h1>
        <p className="mt-1 text-[9px] leading-relaxed text-[#8D8278]">
          Menghapus sesi dan data tersimpan. Anda akan diarahkan ke halaman login.
        </p>
        <LoaderCircle
          size={15}
          className="mx-auto mt-4 animate-spin text-[#C49A4A]"
          aria-label="Memproses logout"
        />
        <span className="sr-only">Mengakhiri sesi admin...</span>
      </section>
    </main>
  );
}
