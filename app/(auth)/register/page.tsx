import RegisterSection from "./components/RegisterSection";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Daftar",
  description: "Buat akun untuk menikmati layanan Kampung Budaya Polowijen.",
  path: "/register",
  robots: { index: false, follow: false },
});

export default function RegisterPage() {
  return <RegisterSection />;
}
