import Image from "next/image";

export default function LoginWelcomeSection() {
  return (
    <>
      <section aria-label="Identitas kampung budaya" className="flex items-center gap-3">
        <div className="flex h-14 w-12 items-center justify-center overflow-hidden rounded-full bg-transparent">
          <Image
            src="/images/logo2.png"
            alt="Logo Kampung Budaya Polowijen"
            width={48}
            height={56}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="leading-none text-white">
          <div className="text-[11px] font-medium tracking-wide text-stone-300">
            Kampung Budaya
          </div>
          <div className="mt-1 text-2xl font-semibold text-white">Polowijen</div>
        </div>
      </section>
      <header className="space-y-2 text-white">
        <h1 className="text-4xl font-bold leading-tight text-[#C49A4A]">
          Selamat Datang
        </h1>
        <p className="text-[15px] font-medium leading-snug">
          Di Kampung Budaya Polowijen
        </p>
        <p className="max-w-116.25 text-[15px] leading-snug text-stone-200">
          Jelajahi kekayaan budaya, temukan cerita di balik setiap karya, dan
          dukung UMKM lokal
        </p>
      </header>
    </>
  );
}
