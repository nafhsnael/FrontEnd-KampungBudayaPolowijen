import Image from "next/image";

export default function RegisterWelcomeSection() {
  return (
    <>
      <div className="flex h-14 items-center gap-3">
        <div className="relative h-14 w-12 shrink-0 overflow-hidden">
          <Image
            src="/images/logo2.png"
            alt="Logo Kampung Budaya Polowijen"
            fill
            sizes="48px"
            className="object-contain"
          />
        </div>
        <div className="leading-none">
          <div className="text-[11px] font-medium text-stone-200">
            Kampung Budaya
          </div>
          <div className="mt-1 text-2xl font-semibold text-white">Polowijen</div>
        </div>
      </div>

      <header className="mt-6">
        <h1 className="text-4xl font-bold leading-tight text-[#E0BF6B]">
          Daftar Akun
        </h1>
        <p className="mt-1 max-w-116.25 text-[15px] leading-snug text-white">
          Buat akun untuk jelajahi kekayaan budaya &quot;Kampung Budaya
          Polowijen&quot;.
        </p>
      </header>
    </>
  );
}
