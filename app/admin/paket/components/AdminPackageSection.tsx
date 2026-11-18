import AdminSidebar from "../../components/AdminSidebar";
import PackageSection from "./PackageSection";

export default function AdminPackageSection() {
  return (
    <div className="flex min-h-screen bg-[#FFF8EC]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-4 py-6 md:px-6 md:py-7">
        <PackageSection />
      </main>
    </div>
  );
}
