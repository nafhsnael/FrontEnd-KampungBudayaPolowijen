import FavoriteSection from "./components/FavoriteSection";
import { UMKM_PRODUCTS } from "@/data/umkm-products";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Produk Favorit",
  description: "Daftar produk UMKM yang disimpan sebagai favorit.",
  path: "/favorite",
  robots: { index: false, follow: false },
});

export default function FavoritePage() {
  return <FavoriteSection products={UMKM_PRODUCTS} />;
}
