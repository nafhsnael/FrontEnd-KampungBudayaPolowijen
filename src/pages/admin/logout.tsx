import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoaderCircle, LogOut } from "lucide-react";

const SESSION_KEYS = [
  "user_role",
  "user_email",
  "app_admin_users_cache",
  "kampung-polowijen-admin-users",
];

export default function AdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    SESSION_KEYS.forEach((key) => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error(`Gagal membersihkan data sesi "${key}".`, error);
      }
    });

    const redirectTimer = setTimeout(() => {
      void router.replace("/admin/login").catch((error: unknown) => {
        console.error("Gagal mengarahkan ke halaman login admin.", error);
      });
    }, 900);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>Keluar | Kampung Budaya Polowijen</title>
      </Head>
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
