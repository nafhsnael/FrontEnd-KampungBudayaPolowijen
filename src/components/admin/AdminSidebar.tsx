import SharedAdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminSidebar({ activeRoute }: { activeRoute: string }) {
  return <SharedAdminSidebar activeRoute={activeRoute} />;
}