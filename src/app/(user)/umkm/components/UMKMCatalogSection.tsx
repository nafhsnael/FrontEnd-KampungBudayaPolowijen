"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import CatalogHeaderSection from "./CatalogHeaderSection";
import ProductDetailSection from "./ProductDetailSection";
import BottomNav from "@/components/layout/BottomNav";
import type { Product } from "@/types/umkm";
import { useFavoriteIds } from "@/hooks/use-favorite-ids";

type ViewMode = "home" | "grid" | "detail";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function UMKMPage({ products }: { products: Product[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [activeNav, setActiveNav] = useState("umkm");
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [quantity, setQuantity] = useState(1);
  const { favoriteIds, storageError, toggleFavorite } = useFavoriteIds();

  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === "Semua" || product.category === category;
    return matchesCategory && product.name.toLowerCase().includes(search.toLowerCase());
  });

  const openDetail = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setViewMode("detail");
  };

  const productName = selectedProduct.name || selectedProduct.title || "Produk UMKM";
  const productImage = selectedProduct.image;
  const productDescription =
    selectedProduct.description ??
    "Produk pilihan dari UMKM Kampung Budaya Polowijen.";
  const productPrice = selectedProduct.price;
  const gallery =
    selectedProduct.gallery?.length ? selectedProduct.gallery : [productImage];

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#F4EBE1] p-0 font-sans text-[#4A2920] sm:p-6">
      <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#FDF8F2] sm:h-211 sm:max-h-[90vh] sm:min-h-0 sm:max-w-105 sm:rounded-[36px] sm:border sm:border-stone-200/80 sm:shadow-2xl">
        {viewMode === "detail" ? (
          <ProductDetailSection
            name={productName}
            image={productImage}
            description={productDescription}
            price={productPrice}
            gallery={gallery}
            quantity={quantity}
            isFavorite={favoriteIds.includes(selectedProduct.id)}
            onBack={() => setViewMode("grid")}
            onToggleFavorite={() => toggleFavorite(selectedProduct.id)}
            onQuantityChange={setQuantity}
            formatPrice={(price) => currencyFormatter.format(price)}
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
            <div className="mt-4 grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} onClick={() => openDetail(product)}>
                  <ProductCard
                    product={product}
                    isFavorite={favoriteIds.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        <BottomNav activeItem={activeNav} onChange={setActiveNav} />
        {storageError && (
          <p role="alert" className="px-5 pb-3 text-center text-xs text-[#9B3D32]">
            {storageError}
          </p>
        )}
      </div>
    </main>
  );
}