import DashboardHero from "./DashboardHero";
import DashboardLinks from "./DashboardLinks";

export default function DashboardSection() {
  return (
    <main className="min-h-screen bg-[#FDF8F2] px-5 py-12 text-[#3D2018]">
      <section className="mx-auto max-w-5xl">
        <DashboardHero />
        <DashboardLinks />
      </section>
    </main>
  );
}
