import { Heart } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/types/umkm";

type ProductCardProps = {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
};

export default function ProductCard({ product, isFavorite = false, onToggleFavorite }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-[#ead7b8] bg-[#4A2920] text-white shadow-sm transition-transform hover:-translate-y-0.5">
      <div className="relative aspect-4/3 bg-[#f1e5d1]">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
        <button type="button" onClick={(event) => { event.stopPropagation(); onToggleFavorite?.(product.id); }} aria-pressed={isFavorite} aria-label={isFavorite ? `Hapus ${product.name} dari favorit` : `Simpan ${product.name}`} className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-[#9B3D32]">
          <Heart size={15} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="space-y-1 p-3">
        <h3 className="truncate text-sm font-bold">{product.name}</h3>
        {product.category && <p className="text-[10px] text-white/70">{product.category}</p>}
        <p className="text-xs font-semibold text-[#f0c978]">Rp{product.price.toLocaleString("id-ID")}</p>
      </div>
    </article>
  );
}
