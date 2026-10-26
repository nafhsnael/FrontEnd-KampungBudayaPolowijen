import Image from "next/image";
import { Heart } from "lucide-react";

export type FavoriteProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
};

type FavoriteProductsSectionProps = {
  products: FavoriteProduct[];
  onRemove: (id: string) => void;
  onExplore: () => void;
};

export default function FavoriteProductsSection({
  products,
  onRemove,
  onExplore,
}: FavoriteProductsSectionProps) {
  if (products.length === 0) {
    return (
      <section className="mt-16 flex flex-col items-center justify-center rounded-3xl border border-[#ead7b8] bg-white/60 px-6 py-16 text-center">
        <Heart size={42} className="text-[#9B3D32]" />
        <h2 className="mt-4 text-lg font-bold">Belum ada produk favorit</h2>
        <p className="mt-2 text-sm text-stone-600">
          Tekan ikon hati pada produk untuk menyimpannya di sini.
        </p>
        <button
          type="button"
          onClick={onExplore}
          className="mt-6 rounded-full bg-[#9B3D32] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Jelajahi UMKM
        </button>
      </section>
    );
  }

  return (
    <section
      aria-label="Daftar produk favorit"
      className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
    >
      {products.map((product) => (
        <article
          key={product.id}
          className="overflow-hidden rounded-xl border border-[#ead7b8] bg-[#3D2018] text-white shadow-sm"
        >
          <div className="relative aspect-4/3 bg-[#f1e5d1]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(product.id)}
              aria-label={`Hapus ${product.name} dari favorit`}
              className="absolute right-2 top-2 rounded-full bg-[#9B3D32] p-1.5 text-white"
            >
              <Heart size={16} fill="currentColor" />
            </button>
          </div>
          <div className="p-3">
            <h2 className="truncate text-sm font-bold">{product.name}</h2>
            <p className="mt-1 text-[10px] text-white/70">{product.category}</p>
            <p className="mt-1 text-xs font-semibold text-[#C49A4A]">
              Rp{product.price.toLocaleString("id-ID")}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
