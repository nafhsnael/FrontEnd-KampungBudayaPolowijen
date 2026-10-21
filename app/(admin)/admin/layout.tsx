import type { ReactNode } from "react";
import RouteGuard from "@/app/components/auth/RouteGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard
      requiredRole="admin"
      loginPath="/admin/login"
      mismatchPath="/login"
      bypassPaths={["/admin/login", "/admin/logout"]}
    >
      {children}
    </RouteGuard>
  );
}
