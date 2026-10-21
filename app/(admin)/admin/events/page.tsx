import type { Metadata } from "next";
import EventsClient from "./components/EventsClient";

export const metadata: Metadata = {
  title: "Event",
};

export default function AdminEventsPage() {
  return <EventsClient />;
}
