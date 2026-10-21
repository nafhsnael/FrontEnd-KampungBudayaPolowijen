import type { Metadata } from "next";
import UmkmClient from "./components/UmkmClient";

export const metadata: Metadata = {
  title: "Kelola UMKM",
};

export default function AdminUmkmPage() {
  return <UmkmClient />;
}
