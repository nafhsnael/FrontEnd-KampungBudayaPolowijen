import Link from "next/link";

export default function HomeActions() {
  return (
    <nav aria-label="Navigasi utama" className="mt-8 flex flex-wrap justify-center gap-3">
      <Link
        href="/umkm"
        className="rounded-full bg-[#C49A4A] px-6 py-3 font-semibold text-white transition hover:bg-[#D4A359]"
      >
        Jelajahi UMKM
      </Link>
      <Link
        href="/login"
        className="rounded-full border border-white/40 px-6 py-3 font-semibold transition hover:bg-white/10"
      >
        Masuk
      </Link>
    </nav>
  );
}
