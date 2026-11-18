import type { EventRecord } from "@/services/admin-content";
import EventCard from "./EventCard";

export default function NearestEventSection({
  event,
  onEdit,
  onDelete,
}: {
  event: EventRecord | null;
  onEdit: (event: EventRecord) => void;
  onDelete: (event: EventRecord) => void;
}) {
  if (!event) {
    return (
      <div className="rounded-2xl border border-[#DED5C8] bg-[#FFF9EF] p-5 text-sm text-[#82766D] shadow-sm">
        Belum ada event terdekat.
      </div>
    );
  }

  return <EventCard event={event} featured onEdit={onEdit} onDelete={onDelete} />;
}
