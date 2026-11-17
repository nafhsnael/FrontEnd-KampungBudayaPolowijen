"use client";

import Link from "next/link";

type ErrorFallbackProps = {
  onRetry: () => void;
};

export default function ErrorFallback({ onRetry }: ErrorFallbackProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FDF8F2] px-5 py-12 text-[#3D2018]">
      <section className="w-full max-w-lg rounded-3xl border border-[#ead7b8] bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9B3D32]">
          Terjadi kendala
        </p>
        <h1 className="mt-3 text-3xl font-bold">Halaman belum dapat ditampilkan</h1>
        <p className="mt-3 text-stone-600">
          Ada masalah saat memuat halaman. Silakan coba lagi atau kembali ke beranda.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-[#9B3D32] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Coba lagi
          </button>
          <Link
            href="/"
            className="rounded-full border border-[#9B3D32] px-5 py-2.5 text-sm font-semibold text-[#9B3D32]"
          >
            Kembali ke beranda
          </Link>
        </div>
      </section>
    </main>
  );
}
