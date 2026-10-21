import type { Metadata } from "next";
import LogoutClient from "./components/LogoutClient";

export const metadata: Metadata = {
  title: "Keluar",
};

export default function AdminLogoutPage() {
  return <LogoutClient />;
}
