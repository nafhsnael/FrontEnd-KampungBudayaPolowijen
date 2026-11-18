import { createPageMetadata } from "@/lib/metadata";
import UmkmDetailSection from "./components/UmkmDetailSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return createPageMetadata({
    title: `Detail UMKM ${id}`,
    description: `Informasi detail produk UMKM ${id} di Kampung Budaya Polowijen.`,
    path: `/umkm/${encodeURIComponent(id)}`,
    robots: { index: false, follow: false },
  });
}

export default async function UmkmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <UmkmDetailSection id={id} />;
}
