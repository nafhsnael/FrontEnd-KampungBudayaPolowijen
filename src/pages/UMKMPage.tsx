"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Heart, Minus, Plus, Search, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/umkm/produk/ProductCard";
import BottomNav from "@/components/layout/BottomNav";
import type { Product } from "@/types/umkm";

type ViewMode = "home" | "grid" | "detail";
type ProductValue = Product & Record<string, unknown>;

const categories = ["Semua", "Makanan", "Kerajinan", "Fashion"];

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
          <section className="animate-fade-in">
            <div className="relative h-75 bg-[#f1e5d1]">
              <button aria-label="Kembali" className="absolute left-4 top-4 z-10 rounded-full bg-white/90 p-2" onClick={() => setViewMode("grid")}><ArrowLeft size={18} /></button>
              <img src={productImage} alt={productName} className="h-full w-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2 px-5 py-4">
              {galleryOf(selectedProduct).slice(0, 4).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="h-16 w-full rounded-lg border border-[#ead7b8] object-cover" />)}
            </div>
            <div className="space-y-4 px-5">
              <div><p className="text-xs uppercase tracking-[0.16em] text-[#9B3D32]">Produk UMKM</p><div className="mt-1 flex items-center justify-between gap-3"><h1 className="text-2xl font-bold">{productName}</h1><button type="button" onClick={() => handleToggleWishlist(selectedProduct.id)} aria-pressed={favoriteIds.includes(selectedProduct.id)} aria-label={favoriteIds.includes(selectedProduct.id) ? "Hapus dari favorit" : "Simpan ke favorit"} className="shrink-0 rounded-full bg-white p-2 text-[#9B3D32] shadow-sm"><Heart size={20} fill={favoriteIds.includes(selectedProduct.id) ? "currentColor" : "none"} /></button></div><p className="mt-1 text-lg font-bold text-[#9B3D32]">{money(productPrice)}</p></div>
              <p className="text-sm leading-6 text-[#6d554a]">{productDescription}</p>
              <div className="flex items-center justify-between border-y border-[#ead7b8] py-4"><span className="text-sm font-semibold">Jumlah</span><div className="flex items-center gap-4"><button aria-label="Kurangi jumlah" className="rounded-full border border-[#4A2920] p-1" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button><span className="w-5 text-center font-bold">{quantity}</span><button aria-label="Tambah jumlah" className="rounded-full bg-[#9B3D32] p-1 text-white" onClick={() => setQuantity(quantity + 1)}><Plus size={14} /></button></div></div>
              <div className="grid grid-cols-2 gap-3"><button className="rounded-full border border-[#9B3D32] py-3 text-sm font-bold text-[#9B3D32]"><ShoppingBag size={16} className="mr-2 inline" />Keranjang</button><button className="rounded-full bg-[#9B3D32] py-3 text-sm font-bold text-white">Check Out</button></div>
            </div>
          </section>
        ) : (
          <section className="px-5 pt-8">
            <header className="flex items-center gap-3"><img src="/images/logo2.png" alt="Logo Kampung Budaya Polowijen" className="h-12 w-12 object-contain" /><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9B3D32]">Kampung Budaya</p><h1 className="text-xl font-bold">Dukung UMKM Lokal</h1></div></header>
            {viewMode === "home" && <p className="mt-4 max-w-sm text-sm leading-5 text-[#6d554a]">Jelajahi produk unggulan dari pelaku UMKM Kampung Budaya Polowijen.</p>}
            <div className="mt-5 flex items-center gap-2 rounded-full border border-[#ead7b8] bg-white px-4 py-3"><Search size={17} className="text-[#9B3D32]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari produk UMKM..." className="w-full bg-transparent text-sm outline-none" /></div>
            {viewMode === "home" && <><div className="mt-5 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold ${category === item ? "bg-[#9B3D32] text-white" : "bg-[#f1e5d1] text-[#4A2920]"}`}>{item}</button>)}</div><div className="mt-5 flex items-center justify-between"><h2 className="text-lg font-bold">Produk unggulan</h2><button onClick={() => setViewMode("grid")} aria-label="Lihat semua produk"><ChevronRight size={20} /></button></div></>}
            {viewMode === "grid" && <button onClick={() => setViewMode("home")} className="mt-5 flex items-center gap-1 text-sm font-semibold"><ArrowLeft size={17} /> Kembali</button>}
            <div className="mt-4 grid grid-cols-2 gap-4">{filteredProducts.map((product) => <div key={String(valueOf(product, "id", productName))} onClick={() => openDetail(product)}><ProductCard product={product} isFavorite={favoriteIds.includes(String(valueOf(product, "id", "")))} onToggleFavorite={toggleFavorite} /></div>)}</div>
          </section>
        )}
        <BottomNav activeItem={activeNav} onChange={setActiveNav} />
      </div>
    </main>
  );
}