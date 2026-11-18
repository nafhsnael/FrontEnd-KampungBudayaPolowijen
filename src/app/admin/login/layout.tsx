import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Login Admin",
  description: "Masuk ke area administrator Kampung Budaya Polowijen.",
  path: "/admin/login",
  robots: { index: false, follow: false },
});

export default function AdminLoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
