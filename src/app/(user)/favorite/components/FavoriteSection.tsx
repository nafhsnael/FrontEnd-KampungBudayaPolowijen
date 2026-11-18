"use client";

import { useRouter } from "next/navigation";
import BottomNav, { type BottomNavItem } from "@/components/layout/BottomNav";
import FavoriteHero from "./FavoriteHero";
import FavoriteProductsSection from "./FavoriteProductsSection";
import { UMKM_PRODUCTS } from "@/data/umkm-products";
import { useFavoriteIds } from "@/hooks/use-favorite-ids";

export default function FavoritePage() {
  const router = useRouter();
  const { favoriteIds, isLoaded, storageError, toggleFavorite } =
    useFavoriteIds();

  const favoriteProducts = UMKM_PRODUCTS.filter((product) =>
    favoriteIds.includes(product.id),
  );

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
        {storageError && (
          <p role="alert" className="mt-5 text-center text-sm text-[#9B3D32]">
            {storageError}
          </p>
        )}
        {isLoaded ? (
          <FavoriteProductsSection
            products={favoriteProducts}
            onRemove={toggleFavorite}
            onExplore={() => void router.push("/umkm")}
          />
        ) : (
          <section
            aria-label="Memuat produk favorit"
            aria-busy="true"
            className="mt-16 min-h-60 rounded-3xl border border-[#ead7b8] bg-white/60"
          />
        )}
      </div>
      <BottomNav activeItem="umkm" onChange={handleNavigation} />
    </main>
  );
}
