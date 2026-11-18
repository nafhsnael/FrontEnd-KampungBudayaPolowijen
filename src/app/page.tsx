import HeroSection from "./components/HeroSection";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Jelajahi Budaya dan Karya Lokal",
  description:
    "Temukan produk UMKM, tradisi, dan cerita warga Kampung Budaya Polowijen, Malang.",
  path: "/",
});

export default function HomePage() {
  return <HeroSection />;
}
