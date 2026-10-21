import type { Metadata } from "next";
import DataUserClient from "./components/DataUserClient";

export const metadata: Metadata = {
  title: "Data User",
};

export default function AdminDataUserPage() {
  return <DataUserClient />;
}
