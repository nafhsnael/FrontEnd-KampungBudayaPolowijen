"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  getAuthRole,
  subscribeAuthSession,
  type UserRole,
} from "@/lib/auth/session";

type RouteGuardProps = {
  children: ReactNode;
  requiredRole: UserRole;
  loginPath: string;
  mismatchPath: string;
  bypassPaths?: string[];
};

export default function RouteGuard({
  children,
  requiredRole,
  loginPath,
  mismatchPath,
  bypassPaths = [],
}: RouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const role = useSyncExternalStore(
    subscribeAuthSession,
    getAuthRole,
    () => null
  );
  const isBypassed = bypassPaths.includes(pathname);

  useEffect(() => {
    if (isBypassed) return;

    if (!role) {
      router.replace(loginPath);
      return;
    }

    if (role !== requiredRole) {
      router.replace(mismatchPath);
    }
  }, [
    isBypassed,
    loginPath,
    mismatchPath,
    role,
    requiredRole,
    router,
  ]);

  if (isBypassed) return children;
  if (role !== requiredRole) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[#FDF8F2] text-[#5C362B]"
        aria-live="polite"
      >
        Memeriksa sesi...
      </main>
    );
  }

  return children;
}
