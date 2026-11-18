export default function UmkmDetailHero({ id }: { id: string }) {
  return (
    <header>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9B3D32]">
        Detail UMKM
      </p>
      <h1 className="mt-2 text-2xl font-bold">UMKM {id}</h1>
      <p className="mt-3 text-stone-600">
        Informasi detail UMKM akan ditampilkan di halaman ini.
      </p>
    </header>
  );
}
