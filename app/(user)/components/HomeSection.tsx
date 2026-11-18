import HomeActions from "./HomeActions";
import HomeHero from "./HomeHero";
import JsonLd from "@/app/components/seo/JsonLd";
import { siteUrl } from "@/lib/site-url";

export default function HomeSection() {
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
