import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#FDF8F2] px-5 py-12 text-[#3D2018]">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9B3D32]">
          Area Pengguna
        </p>
        <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-stone-600">
          Temukan produk lokal atau lanjutkan melihat daftar favorit Anda.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/umkm"
            className="rounded-2xl border border-[#ead7b8] bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-xl font-bold">Jelajahi UMKM</h2>
            <p className="mt-2 text-sm text-stone-600">
              Lihat produk dan karya dari pelaku UMKM Polowijen.
            </p>
          </Link>
          <Link
            href="/favorite"
            className="rounded-2xl border border-[#ead7b8] bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-xl font-bold">Produk Favorit</h2>
            <p className="mt-2 text-sm text-stone-600">
              Kembali ke produk yang Anda simpan.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
