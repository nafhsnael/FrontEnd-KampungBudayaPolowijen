import type { ReactNode } from "react";
import RouteGuard from "@/components/auth/RouteGuard";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Dashboard Pengguna",
  description: "Area pengguna untuk mengakses produk lokal dan daftar favorit.",
  path: "/dashboard",
  robots: { index: false, follow: false },
});

export default function UserDashboardLayout({
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
