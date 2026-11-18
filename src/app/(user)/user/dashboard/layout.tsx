import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Beranda",
  description:
    "Jelajahi cerita, kegiatan, dan karya warga Kampung Budaya Polowijen.",
  path: "/user/dashboard",
  robots: { index: false, follow: false },
});

export default function UserDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
