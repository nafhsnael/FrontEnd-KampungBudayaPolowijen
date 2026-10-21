import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#4A2920] px-6 py-16 text-center text-[#FDF8F2]">
      <section className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4A359]">
          Kampung Budaya Polowijen
        </p>
        <h1 className="mt-4 text-4xl font-bold sm:text-6xl">
          Jelajahi Budaya dan Karya Lokal
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/80">
          Temukan produk UMKM dan cerita budaya dari Kampung Budaya Polowijen.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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
        </div>
      </section>
    </main>
  );
}
