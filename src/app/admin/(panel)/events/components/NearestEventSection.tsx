import type { EventRecord } from "@/services/admin-content";
import EventCard from "./EventCard";

export default function NearestEventSection({
  events,
  onEdit,
  onDelete,
}: {
  events: EventRecord[];
  onEdit: (event: EventRecord) => void;
  onDelete: (event: EventRecord) => void;
}) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-[#DED5C8] bg-[#FFF9EF] p-5 text-sm text-[#82766D] shadow-sm">
        Belum ada event terdekat.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          featured
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
