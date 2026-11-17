import type { Metadata } from "next";
import { blobAsset } from "./blob-assets";
import { siteUrl } from "./site-url";

const siteName = "Kampung Budaya Polowijen";
const shareImage = blobAsset("/images/dashboard-topeng.jpg");

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  robots?: Metadata["robots"];
};

export function createPageMetadata({
  title,
  description,
  path,
  robots,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "id_ID",
      siteName,
      url: new URL(path, siteUrl).toString(),
      images: [{ url: shareImage, alt: "Pertunjukan Tari Topeng Malangan di Polowijen" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
    ...(robots ? { robots } : {}),
  };
}
