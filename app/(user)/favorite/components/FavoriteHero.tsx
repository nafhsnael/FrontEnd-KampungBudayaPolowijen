import { ArrowLeft } from "lucide-react";

export default function FavoriteHero({ onBack }: { onBack: () => void }) {
  return (
    <header className="flex items-start gap-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Kembali"
        className="rounded-full p-2 text-[#3D2018] transition hover:bg-[#ead7b8]"
      >
        <ArrowLeft size={22} />
      </button>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9B3D32]">
          Wishlist UMKM
        </p>
        <h1 className="text-2xl font-bold">Produk Favorit Saya</h1>
        <p className="mt-1 text-sm text-stone-600">
          Simpan produk yang ingin kamu lihat lagi.
        </p>
      </div>
    </header>
  );
}
