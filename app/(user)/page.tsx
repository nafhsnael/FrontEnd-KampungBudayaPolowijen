import HomeActions from "./components/HomeActions";
import HomeHero from "./components/HomeHero";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#4A2920] px-6 py-16 text-center text-[#FDF8F2]">
      <section className="max-w-2xl">
        <HomeHero />
        <HomeActions />
      </section>
    </main>
  );
}
