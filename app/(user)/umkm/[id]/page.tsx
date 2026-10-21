import Link from "next/link";

export default async function UmkmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#FDF8F2] px-5 py-12 text-[#3D2018]">
      <article className="mx-auto max-w-3xl rounded-3xl border border-[#ead7b8] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9B3D32]">
          Detail UMKM
        </p>
        <h1 className="mt-2 text-2xl font-bold">UMKM {id}</h1>
        <p className="mt-3 text-stone-600">
          Informasi detail UMKM akan ditampilkan di halaman ini.
        </p>
        <Link
          href="/umkm"
          className="mt-6 inline-flex rounded-full bg-[#9B3D32] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Kembali ke daftar UMKM
        </Link>
      </article>
    </main>
  );
}
