import Image from "next/image";
import Link from "next/link";
import AdminLoginClient from "./components/AdminLoginClient";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#3D2018] p-0 text-[#FDF8F2] sm:p-6">
      <section className="flex min-h-screen w-full max-w-105 flex-col justify-center bg-[#5C362B]/90 p-8 shadow-2xl sm:min-h-0 sm:rounded-[28px] sm:border sm:border-amber-900/40">
        <header className="mb-8 text-center">
          <Image
            src="/images/logo2.png"
            alt="Logo Kampung Budaya Polowijen"
            width={80}
            height={80}
            className="mx-auto h-20 w-20 object-contain"
          />
          <h1 className="mt-4 font-serif text-3xl font-bold text-[#D4A359]">
            Login Admin
          </h1>
          <p className="mt-2 text-sm text-stone-300">
            Masuk ke akun administrator Anda.
          </p>
        </header>

        <AdminLoginClient />

        <div className="mt-6 border-t border-amber-900/40 pt-4 text-center">
          <p className="text-sm text-stone-300">
            Bukan admin?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#D4A359] hover:underline"
            >
              Login sebagai pengguna
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
