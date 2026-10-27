"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { clearAuthSession, getAuthSession } from "@/lib/auth/session";
import { logout } from "@/services/auth";
import LogoutStatusSection from "./LogoutStatusSection";

const ADMIN_CACHE_KEYS = [
  "app_admin_users_cache",
  "kampung-polowijen-admin-users",
];

export default function AdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const signOut = async () => {
      const session = getAuthSession();
      clearAuthSession();
      ADMIN_CACHE_KEYS.forEach((key) => {
        try {
          window.localStorage.removeItem(key);
        } catch (error) {
          console.error(`Gagal membersihkan cache "${key}".`, error);
        }
      });
      try {
        if (session) await logout(session.accessToken);
      } catch (error) {
        console.warn("Sesi server tidak dapat dibatalkan (server offline).", error);
      } finally {
        if (!cancelled) {
          redirectTimer = setTimeout(() => {
            router.replace("/admin/login");
          }, 900);
        }
      }
    };

    void signOut();
    return () => {
      cancelled = true;
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <>
      <main className="flex min-h-screen items-center justify-center bg-[#FAF3E0] px-5 text-[#3D2018]">
        <LogoutStatusSection />
      </main>
    </>
  );
}
