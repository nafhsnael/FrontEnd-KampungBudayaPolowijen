import UmkmDetailActions from "./components/UmkmDetailActions";
import UmkmDetailHero from "./components/UmkmDetailHero";

export default async function UmkmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#FDF8F2] px-5 py-12 text-[#3D2018]">
      <article className="mx-auto max-w-3xl rounded-3xl border border-[#ead7b8] bg-white p-8 shadow-sm">
        <UmkmDetailHero id={id} />
        <UmkmDetailActions />
      </article>
    </main>
  );
}
