import { ArrowLeft, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";

type ProductDetailSectionProps = {
  name: string;
  image: string;
  description: string;
  price: number;
  gallery: string[];
  quantity: number;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
  onQuantityChange: (quantity: number) => void;
  formatPrice: (price: number) => string;
};

export default function ProductDetailSection({
  name,
  image,
  description,
  price,
  gallery,
  quantity,
  isFavorite,
  onBack,
  onToggleFavorite,
  onQuantityChange,
  formatPrice,
}: ProductDetailSectionProps) {
  return (
    <section className="animate-fade-in">
      <div className="relative h-75 bg-[#f1e5d1]">
        <button
          type="button"
          aria-label="Kembali"
          className="absolute left-4 top-4 z-10 rounded-full bg-white/90 p-2"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
        </button>
        <Image src={image} alt={name} fill sizes="100vw" className="object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-2 px-5 py-4">
        {gallery.slice(0, 4).map((galleryImage, index) => (
          <div
            key={`${galleryImage}-${index}`}
            className="relative h-16 overflow-hidden rounded-lg border border-[#ead7b8]"
          >
            <Image src={galleryImage} alt="" fill sizes="25vw" className="object-cover" />
          </div>
        ))}
      </div>
      <div className="space-y-4 px-5">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#9B3D32]">Produk UMKM</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold">{name}</h1>
            <button
              type="button"
              onClick={onToggleFavorite}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? "Hapus dari favorit" : "Simpan ke favorit"}
              className="shrink-0 rounded-full bg-white p-2 text-[#9B3D32] shadow-sm"
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
          <p className="mt-1 text-lg font-bold text-[#9B3D32]">{formatPrice(price)}</p>
        </div>
        <p className="text-sm leading-6 text-[#6d554a]">{description}</p>
        <div className="flex items-center justify-between border-y border-[#ead7b8] py-4">
          <span className="text-sm font-semibold">Jumlah</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Kurangi jumlah"
              className="rounded-full border border-[#4A2920] p-1"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            >
              <Minus size={14} />
            </button>
            <span className="w-5 text-center font-bold">{quantity}</span>
            <button
              type="button"
              aria-label="Tambah jumlah"
              className="rounded-full bg-[#9B3D32] p-1 text-white"
              onClick={() => onQuantityChange(quantity + 1)}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-full border border-[#9B3D32] py-3 text-sm font-bold text-[#9B3D32]">
            <ShoppingBag size={16} className="mr-2 inline" />
            Keranjang
          </button>
          <button className="rounded-full bg-[#9B3D32] py-3 text-sm font-bold text-white">
            Check Out
          </button>
        </div>
      </div>
    </section>
  );
}
