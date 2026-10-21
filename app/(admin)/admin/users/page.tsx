import type { Metadata } from "next";
import UsersClient from "./components/UsersClient";

export const metadata: Metadata = {
  title: "Data User",
};

export default function AdminUsersPage() {
  return <UsersClient />;
}
