import type { Metadata } from "next";
import DataUserClient from "../data-user/components/DataUserClient";

export const metadata: Metadata = {
  title: "Data User",
};

export default function AdminUsersPage() {
  return <DataUserClient />;
}
