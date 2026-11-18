import UmkmDetailSection from "./components/UmkmDetailSection";

export default async function UmkmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <UmkmDetailSection id={id} />;
}
