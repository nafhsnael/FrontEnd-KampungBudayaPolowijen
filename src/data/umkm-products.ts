import { blobAsset } from "@/lib/blob-assets";
import type { Product } from "@/types/umkm";

const batikImage = blobAsset("/images/produk-batik.svg");
const keripikImage = blobAsset("/images/produk-keripik.svg");
const anyamanImage = blobAsset("/images/produk-anyaman.svg");
const kopiImage = blobAsset("/images/produk-kopi.svg");

export const UMKM_PRODUCTS: Product[] = [
  {
    id: "batik-polowijen",
    name: "Batik Polowijen",
    price: 125000,
    image: batikImage,
    category: "Fashion",
    description:
      "Batik khas Polowijen dengan motif budaya lokal yang dibuat secara teliti oleh pengrajin kampung.",
    gallery: [batikImage, batikImage, batikImage, batikImage],
  },
  {
    id: "keripik-tempe",
    name: "Keripik Tempe",
    price: 25000,
    image: keripikImage,
    category: "Makanan",
    description:
      "Keripik tempe renyah dengan bumbu gurih, dibuat dari bahan pilihan UMKM Kampung Budaya Polowijen.",
    gallery: [keripikImage, keripikImage, keripikImage, keripikImage],
  },
  {
    id: "anyaman-bambu",
    name: "Anyaman Bambu",
    price: 85000,
    image: anyamanImage,
    category: "Kerajinan",
    description:
      "Kerajinan anyaman bambu fungsional yang dikerjakan dengan teknik tradisional oleh warga Polowijen.",
    gallery: [anyamanImage, anyamanImage, anyamanImage, anyamanImage],
  },
  {
    id: "kopi-polowijen",
    name: "Kopi Polowijen",
    price: 45000,
    image: kopiImage,
    category: "Makanan",
    description:
      "Kopi pilihan dengan aroma hangat untuk menemani cerita dan kegiatan di Kampung Budaya.",
    gallery: [kopiImage, kopiImage, kopiImage, kopiImage],
  },
];
