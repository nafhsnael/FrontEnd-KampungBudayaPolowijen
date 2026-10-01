import { useEffect, useState } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import BottomNav, { type BottomNavItem } from "@/components/layout/BottomNav";

type FavoriteProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
};

const products: FavoriteProduct[] = [
  { id: "batik-polowijen", name: "Batik Polowijen", category: "Fashion", price: 125000, image: "/images/produk-batik.svg" },
  { id: "keripik-tempe", name: "Keripik Tempe", category: "Makanan", price: 25000, image: "/images/produk-keripik.svg" },
  { id: "anyaman-bambu", name: "Anyaman Bambu", category: "Kerajinan", price: 85000, image: "/images/produk-anyaman.svg" },
  { id: "kopi-polowijen", name: "Kopi Polowijen", category: "Makanan", price: 45000, image: "/images/produk-kopi.svg" },
];

export default function FavoritePage() {
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const savedFavorites = window.localStorage.getItem("favoriteProducts");
    return savedFavorites ? (JSON.parse(savedFavorites) as string[]) : [];
  });

  useEffect(() => {
    window.localStorage.setItem("favoriteProducts", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((current) => current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id]);
  };

  const favoriteProducts = products.filter((product) => favoriteIds.includes(product.id));

  const handleNavigation = (item: BottomNavItem) => {
    const routes: Record<BottomNavItem, string> = {
      home: "/user/umkm",
      umkm: "/user/umkm",
      komunitas: "/user/umkm",
      agenda: "/user/umkm",
      profil: "/user/umkm",
    };
    void router.push(routes[item]);
  };

  return (
    <main className="min-h-screen bg-[#FDF8F2] pb-24 text-[#3D2018]">
      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-6 sm:px-8 md:px-12">
        <header className="flex items-start gap-4">
          <button type="button" onClick={() => void router.back()} aria-label="Kembali" className="rounded-full p-2 text-[#3D2018] transition hover:bg-[#ead7b8]"><ArrowLeft size={22} /></button>
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9B3D32]">Wishlist UMKM</p><h1 className="text-2xl font-bold">Produk Favorit Saya</h1><p className="mt-1 text-sm text-stone-600">Simpan produk yang ingin kamu lihat lagi.</p></div>
        </header>

        {favoriteProducts.length === 0 ? (
          <section className="mt-16 flex flex-col items-center justify-center rounded-3xl border border-[#ead7b8] bg-white/60 px-6 py-16 text-center"><Heart size={42} className="text-[#9B3D32]" /><h2 className="mt-4 text-lg font-bold">Belum ada produk favorit</h2><p className="mt-2 text-sm text-stone-600">Tekan ikon hati pada produk untuk menyimpannya di sini.</p><button type="button" onClick={() => void router.push("/user/umkm")} className="mt-6 rounded-full bg-[#9B3D32] px-5 py-2.5 text-sm font-semibold text-white">Jelajahi UMKM</button></section>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">{favoriteProducts.map((product) => <article key={product.id} className="overflow-hidden rounded-xl border border-[#ead7b8] bg-[#3D2018] text-white shadow-sm"><div className="relative aspect-4/3 bg-[#f1e5d1]"><Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" /><button type="button" onClick={() => toggleFavorite(product.id)} aria-label={`Hapus ${product.name} dari favorit`} className="absolute right-2 top-2 rounded-full bg-[#9B3D32] p-1.5 text-white"><Heart size={16} fill="currentColor" /></button></div><div className="p-3"><h2 className="truncate text-sm font-bold">{product.name}</h2><p className="mt-1 text-[10px] text-white/70">{product.category}</p><p className="mt-1 text-xs font-semibold text-[#C49A4A]">Rp{product.price.toLocaleString("id-ID")}</p></div></article>)}</div>
        )}
      </div>
      <BottomNav activeItem="umkm" onChange={handleNavigation} />
    </main>
  );
}
