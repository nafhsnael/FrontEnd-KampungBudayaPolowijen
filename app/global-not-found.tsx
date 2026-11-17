import type { Metadata } from "next";
import "@/styles/globals.css";
import NotFoundContent from "./components/errors/NotFoundContent";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan | Kampung Budaya Polowijen",
};

export default function GlobalNotFoundPage() {
  return (
    <html lang="id">
      <body>
        <NotFoundContent />
      </body>
    </html>
  );
}
