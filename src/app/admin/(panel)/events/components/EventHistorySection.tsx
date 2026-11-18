import type { EventRecord } from "@/services/admin-content";
import EventCard from "./EventCard";

export default function EventHistorySection({
  events,
  onEdit,
  onDelete,
}: {
  events: EventRecord[];
  onEdit: (event: EventRecord) => void;
  onDelete: (event: EventRecord) => void;
}) {
  return (
    <section aria-labelledby="event-history-title">
      <h2
        id="event-history-title"
        className="mb-3 text-base font-bold text-[#4A342A]"
      >
        Riwayat Event:
      </h2>
      <div className="space-y-4">
        {events.length === 0 && (
          <p className="rounded-xl border border-dashed border-[#DDD0C0] px-4 py-5 text-center text-sm text-[#92877D]">
            Belum ada riwayat event.
          </p>
        )}
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
