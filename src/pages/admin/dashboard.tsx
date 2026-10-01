import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    void router.replace("/admin/umkm");
  }, [router]);

  return null;
}
