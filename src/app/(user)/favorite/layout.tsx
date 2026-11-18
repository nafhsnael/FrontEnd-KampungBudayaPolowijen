import type { ReactNode } from "react";
import RouteGuard from "@/components/auth/RouteGuard";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Produk Favorit",
  description: "Daftar produk UMKM yang disimpan sebagai favorit.",
  path: "/favorite",
  robots: { index: false, follow: false },
});

export default function UserFavoriteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RouteGuard
      requiredRole="user"
      loginPath="/login"
      mismatchPath="/admin/dashboard"
    >
      {children}
    </RouteGuard>
  );
}
