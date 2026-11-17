import HomeActions from "./components/HomeActions";
import HomeHero from "./components/HomeHero";
import JsonLd from "@/app/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { siteUrl } from "@/lib/site-url";

export const metadata = createPageMetadata({
  title: "Jelajahi Budaya dan Karya Lokal",
  description:
    "Temukan produk UMKM, tradisi, dan cerita warga Kampung Budaya Polowijen, Malang.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Kampung Budaya Polowijen",
          description:
            "Portal untuk mengenal cerita budaya, kegiatan kampung, dan karya UMKM lokal Malang.",
          url: siteUrl.toString(),
          inLanguage: "id-ID",
        }}
      />
      <main className="flex min-h-screen items-center justify-center bg-[#4A2920] px-6 py-16 text-center text-[#FDF8F2]">
        <section className="max-w-2xl">
          <HomeHero />
          <HomeActions />
        </section>
      </main>
    </>
  );
}
