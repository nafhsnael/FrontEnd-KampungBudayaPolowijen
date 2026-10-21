"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import { clearAuthSession } from "@/lib/auth/session";

const ADMIN_CACHE_KEYS = [
  "app_admin_users_cache",
  "kampung-polowijen-admin-users",
];

export default function AdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    clearAuthSession();

    ADMIN_CACHE_KEYS.forEach((key) => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error(`Gagal membersihkan cache "${key}".`, error);
      }
    });

    const redirectTimer = setTimeout(() => {
      router.replace("/admin/login");
    }, 900);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <>
      <main className="flex min-h-screen items-center justify-center bg-[#FAF3E0] px-5 text-[#3D2018]">
        <section
          className="w-full max-w-md rounded-3xl border border-[#E8DDD1] bg-[#FDF8F2] px-7 py-10 text-center shadow-xl"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F7E8E4] text-[#FF4D4D]">
            <LogOut size={27} aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold">Sedang Keluar</h1>
          <p className="mt-2 text-sm text-[#75685F]">
            Menghapus sesi dan data tersimpan. Anda akan diarahkan ke halaman login.
          </p>
          <LoaderCircle
            size={22}
            className="mx-auto mt-6 animate-spin text-[#C59B4E]"
            aria-label="Memproses logout"
          />
        </section>
      </main>
    </>
  );
}
