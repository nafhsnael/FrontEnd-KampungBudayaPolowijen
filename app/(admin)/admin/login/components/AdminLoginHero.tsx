import Image from "next/image";

export default function AdminLoginHero() {
  return (
    <header className="mb-8 text-center">
      <Image
        src="/images/logo2.png"
        alt="Logo Kampung Budaya Polowijen"
        width={80}
        height={80}
        className="mx-auto h-20 w-20 object-contain"
      />
      <h1 className="mt-4 font-serif text-3xl font-bold text-[#D4A359]">
        Login Admin
      </h1>
      <p className="mt-2 text-sm text-stone-300">
        Masuk ke akun administrator Anda.
      </p>
    </header>
  );
}
