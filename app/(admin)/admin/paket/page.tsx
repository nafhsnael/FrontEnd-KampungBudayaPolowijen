import type { Metadata } from "next";
import PaketClient from "./components/PaketClient";

export const metadata: Metadata = {
  title: "Paket Kunjungan",
};

export default function AdminPaketPage() {
  return <PaketClient />;
}
