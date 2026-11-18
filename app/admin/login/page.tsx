import { createPageMetadata } from "@/lib/metadata";
import AdminLoginClient from "./components/AdminLoginClient";

export const metadata = createPageMetadata({
  title: "Login Admin",
  description: "Masuk ke area administrator Kampung Budaya Polowijen.",
  path: "/admin/login",
  robots: { index: false, follow: false },
});

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
