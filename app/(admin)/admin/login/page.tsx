import AdminLoginFooter from "./components/AdminLoginFooter";
import AdminLoginHero from "./components/AdminLoginHero";
import AdminLoginClient from "./components/AdminLoginClient";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#3D2018] p-0 text-[#FDF8F2] sm:p-6">
      <section className="flex min-h-screen w-full max-w-105 flex-col justify-center bg-[#5C362B]/90 p-8 shadow-2xl sm:min-h-0 sm:rounded-[28px] sm:border sm:border-amber-900/40">
        <AdminLoginHero />
        <AdminLoginClient />
        <AdminLoginFooter />
      </section>
    </main>
  );
}
