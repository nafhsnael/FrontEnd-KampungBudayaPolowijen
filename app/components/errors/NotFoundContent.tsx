import Link from "next/link";

export default function NotFoundContent() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FDF8F2] px-5 py-12 text-[#3D2018]">
      <section className="w-full max-w-lg rounded-3xl border border-[#ead7b8] bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9B3D32]">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-bold">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-stone-600">
          Tautan mungkin sudah berubah atau halaman yang dicari tidak tersedia.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-[#9B3D32] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Kembali ke beranda
        </Link>
      </section>
    </main>
  );
}
