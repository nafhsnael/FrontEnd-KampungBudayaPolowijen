import DashboardSection from "./components/DashboardSection";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Dashboard Pengguna",
  description: "Area pengguna untuk mengakses produk lokal dan daftar favorit.",
  path: "/dashboard",
  robots: { index: false, follow: false },
});

export default function DashboardPage() {
  return <DashboardSection />;
}
