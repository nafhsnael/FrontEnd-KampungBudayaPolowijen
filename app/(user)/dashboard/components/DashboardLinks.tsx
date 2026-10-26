import Link from "next/link";

export default function DashboardLinks() {
  return (
    <section aria-label="Jelajahi fitur" className="mt-8 grid gap-4 sm:grid-cols-2">
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
    </section>
  );
}
