import Link from "next/link";

export default function UmkmDetailActions() {
  return (
    <nav aria-label="Navigasi detail UMKM" className="mt-6">
      <Link
        href="/umkm"
        className="inline-flex rounded-full bg-[#9B3D32] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Kembali ke daftar UMKM
      </Link>
    </nav>
  );
}
