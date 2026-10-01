import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kampung Budaya Polowijen",
    template: "%s | Kampung Budaya Polowijen",
  },
  description:
    "Portal resmi Kampung Budaya Polowijen — jelajahi kekayaan budaya, temukan cerita di balik setiap karya, dan dukung UMKM lokal Malang.",
  keywords: ["kampung budaya", "polowijen", "malang", "wayang", "budaya jawa", "UMKM"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-(--font-jakarta)">
        {children}
      </body>
    </html>
  );
}
