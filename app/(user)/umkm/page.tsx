import UMKMSection from "./components/UMKMSection";
import { UMKM_PRODUCTS } from "@/data/umkm-products";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Produk UMKM Lokal",
  description:
    "Jelajahi batik, makanan, kerajinan, dan produk unggulan pelaku UMKM Kampung Budaya Polowijen.",
  path: "/umkm",
});

export default function UserUMKMPage() {
  return <UMKMSection products={UMKM_PRODUCTS} />;
}
