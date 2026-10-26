"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav, { type BottomNavItem } from "@/app/components/layout/BottomNav";
import FavoriteHero from "./FavoriteHero";
import FavoriteProductsSection, { type FavoriteProduct } from "./FavoriteProductsSection";

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
      home: "/dashboard",
      umkm: "/umkm",
      komunitas: "/dashboard",
      agenda: "/dashboard",
      profil: "/dashboard",
    };
    void router.push(routes[item]);
  };

  return (
    <main className="min-h-screen bg-[#FDF8F2] pb-24 text-[#3D2018]">
      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-6 sm:px-8 md:px-12">
        <FavoriteHero onBack={() => void router.back()} />
        <FavoriteProductsSection
          products={favoriteProducts}
          onRemove={toggleFavorite}
          onExplore={() => void router.push("/umkm")}
        />
      </div>
      <BottomNav activeItem="umkm" onChange={handleNavigation} />
    </main>
  );
}
