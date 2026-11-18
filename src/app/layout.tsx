import type { Metadata } from "next";
import { Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { blobAsset } from "@/lib/blob-assets";
import { siteUrl } from "@/lib/site-url";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const siteDescription =
  "Portal Kampung Budaya Polowijen untuk mengenal cerita budaya, kegiatan kampung, dan karya UMKM lokal Malang.";
const shareImage = blobAsset("/images/dashboard-topeng.jpg");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Kampung Budaya Polowijen",
    template: "%s | Kampung Budaya Polowijen",
  },
  description: siteDescription,
  keywords: ["kampung budaya", "polowijen", "malang", "wayang", "budaya jawa", "UMKM"],
  openGraph: {
    title: "Kampung Budaya Polowijen",
    description: siteDescription,
    type: "website",
    locale: "id_ID",
    siteName: "Kampung Budaya Polowijen",
    url: siteUrl.toString(),
    images: [{ url: shareImage, alt: "Pertunjukan Tari Topeng Malangan di Polowijen" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kampung Budaya Polowijen",
    description: siteDescription,
    images: [shareImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-(--font-jakarta)">
        {children}
      </body>
    </html>
  );
}
