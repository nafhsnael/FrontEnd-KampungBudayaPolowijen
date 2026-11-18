import AdminSidebar from "../../components/AdminSidebar";
import DashboardSection from "./DashboardSection";

export default function AdminDashboardSection() {
  return (
    <div className="flex min-h-screen bg-[#FFF8EC]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-4 py-6 md:px-6 md:py-7">
        <DashboardSection />
      </main>
    </div>
  );
}
