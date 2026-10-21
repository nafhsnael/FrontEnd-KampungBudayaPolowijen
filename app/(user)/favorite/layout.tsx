import type { ReactNode } from "react";
import RouteGuard from "@/app/components/auth/RouteGuard";

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
