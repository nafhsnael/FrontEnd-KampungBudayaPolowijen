"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import CatalogHeaderSection from "./CatalogHeaderSection";
import ProductDetailSection from "./ProductDetailSection";
import BottomNav from "@/app/components/layout/BottomNav";
import type { Product } from "@/types/umkm";

type ViewMode = "home" | "grid" | "detail";
type ProductValue = Product & Record<string, unknown>;

const products = [
  {
    id: "batik-polowijen",
    name: "Batik Polowijen",
    title: "Batik Polowijen",
    price: 125000,
    image: "/images/produk-batik.svg",
    category: "Fashion",
    description: "Batik khas Polowijen dengan motif budaya lokal yang dibuat secara teliti oleh pengrajin kampung.",
    gallery: ["/images/produk-batik.svg", "/images/produk-batik.svg", "/images/produk-batik.svg", "/images/produk-batik.svg"],
  },
  {
    id: "keripik-tempe",
    name: "Keripik Tempe",
    title: "Keripik Tempe",
    price: 25000,
    image: "/images/produk-keripik.svg",
    category: "Makanan",
    description: "Keripik tempe renyah dengan bumbu gurih, dibuat dari bahan pilihan UMKM Kampung Budaya Polowijen.",
    gallery: ["/images/produk-keripik.svg", "/images/produk-keripik.svg", "/images/produk-keripik.svg", "/images/produk-keripik.svg"],
  },
  {
    id: "anyaman-bambu",
    name: "Anyaman Bambu",
    title: "Anyaman Bambu",
    price: 85000,
    image: "/images/produk-anyaman.svg",
    category: "Kerajinan",
    description: "Kerajinan anyaman bambu fungsional yang dikerjakan dengan teknik tradisional oleh warga Polowijen.",
    gallery: ["/images/produk-anyaman.svg", "/images/produk-anyaman.svg", "/images/produk-anyaman.svg", "/images/produk-anyaman.svg"],
  },
  {
    id: "kopi-polowijen",
    name: "Kopi Polowijen",
    title: "Kopi Polowijen",
    price: 45000,
    image: "/images/produk-kopi.svg",
    category: "Makanan",
    description: "Kopi pilihan dengan aroma hangat untuk menemani cerita dan kegiatan di Kampung Budaya.",
    gallery: ["/images/produk-kopi.svg", "/images/produk-kopi.svg", "/images/produk-kopi.svg", "/images/produk-kopi.svg"],
  },
] as unknown as Product[];

function valueOf(product: Product, key: string, fallback: string | number) {
  const value = (product as ProductValue)[key];
  return typeof value === "string" || typeof value === "number" ? value : fallback;
}

function galleryOf(product: Product) {
  const gallery = (product as ProductValue).gallery;
  return Array.isArray(gallery) && gallery.length > 0 ? gallery.filter((item): item is string => typeof item === "string") : [String(valueOf(product, "image", "/images/logo2.png"))];
}

export default function UMKMPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [activeNav, setActiveNav] = useState("umkm");
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [quantity, setQuantity] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const savedFavorites = window.localStorage.getItem("favoriteProducts");
    return savedFavorites ? (JSON.parse(savedFavorites) as string[]) : [];
  });

  useEffect(() => {
    window.localStorage.setItem("favoriteProducts", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (productId: string) => {
    setFavoriteIds((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
  };

  const handleToggleWishlist = (productId: string) => {
    toggleFavorite(productId);
  };

  const filteredProducts = useMemo(() => products.filter((product) => {
    const name = String(valueOf(product, "name", valueOf(product, "title", "Produk"))).toLowerCase();
    const productCategory = String(valueOf(product, "category", ""));
    return (category === "Semua" || productCategory === category) && name.includes(search.toLowerCase());
  }), [category, search]);

  const openDetail = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setViewMode("detail");
  };

  const productName = String(valueOf(selectedProduct, "name", valueOf(selectedProduct, "title", "Produk UMKM")));
  const productImage = String(valueOf(selectedProduct, "image", "/images/logo2.png"));
  const productDescription = String(valueOf(selectedProduct, "description", "Produk pilihan dari UMKM Kampung Budaya Polowijen."));
  const productPrice = Number(valueOf(selectedProduct, "price", 0));
  const money = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#F4EBE1] p-0 font-sans text-[#4A2920] sm:p-6">
      <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#FDF8F2] sm:h-211 sm:max-h-[90vh] sm:min-h-0 sm:max-w-105 sm:rounded-[36px] sm:border sm:border-stone-200/80 sm:shadow-2xl">
        {viewMode === "detail" ? (
          <ProductDetailSection
            name={productName}
            image={productImage}
            description={productDescription}
            price={productPrice}
            gallery={galleryOf(selectedProduct)}
            quantity={quantity}
            isFavorite={favoriteIds.includes(selectedProduct.id)}
            onBack={() => setViewMode("grid")}
            onToggleFavorite={() => handleToggleWishlist(selectedProduct.id)}
            onQuantityChange={setQuantity}
            formatPrice={money}
          />
        ) : (
          <>
            <CatalogHeaderSection
              viewMode={viewMode}
              category={category}
              search={search}
              onCategoryChange={setCategory}
              onSearchChange={setSearch}
              onShowAll={() => setViewMode("grid")}
              onShowHome={() => setViewMode("home")}
            />
            <div className="mt-4 grid grid-cols-2 gap-4">{filteredProducts.map((product) => <div key={String(valueOf(product, "id", productName))} onClick={() => openDetail(product)}><ProductCard product={product} isFavorite={favoriteIds.includes(String(valueOf(product, "id", "")))} onToggleFavorite={toggleFavorite} /></div>)}</div>
          </>
        )}
        <BottomNav activeItem={activeNav} onChange={setActiveNav} />
      </div>
    </main>
  );
}