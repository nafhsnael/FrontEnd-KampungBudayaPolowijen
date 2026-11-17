import FavoriteClient from "./FavoriteClient";
import { UMKM_PRODUCTS } from "@/data/umkm-products";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Produk Favorit",
  description: "Daftar produk UMKM yang disimpan sebagai favorit.",
  path: "/favorite",
  robots: { index: false, follow: false },
});

export default function FavoritePage() {
  return <FavoriteClient products={UMKM_PRODUCTS} />;
}
