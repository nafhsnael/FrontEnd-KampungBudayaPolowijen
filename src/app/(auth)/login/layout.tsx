import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Masuk",
  description: "Masuk ke akun Kampung Budaya Polowijen.",
  path: "/login",
  robots: { index: false, follow: false },
});

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
