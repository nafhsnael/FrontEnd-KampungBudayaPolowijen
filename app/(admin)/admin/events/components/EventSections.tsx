import Image from "next/image";
import { Archive, CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";

export type EventItem = {
  id: number;
  name: string;
  image: string;
  date: string;
  dateOrder: number;
  description: string;
  capacity: string;
  price: string;
};

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="event-info">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CardActions({
  className = "",
  onEdit,
  onDelete,
  onMoveToHistory,
}: {
  className?: string;
  onEdit: () => void;
  onDelete: () => void;
  onMoveToHistory?: () => void;
}) {
  return (
    <div className={`card-actions ${className}`}>
      <button type="button" onClick={onEdit} aria-label="Edit event" title="Edit event">
        <Pencil size={15} aria-hidden="true" />
      </button>
      {onMoveToHistory && (
        <button
          type="button"
          onClick={onMoveToHistory}
          aria-label="Pindahkan ke riwayat"
          title="Pindahkan ke riwayat"
        >
          <Archive size={15} aria-hidden="true" />
        </button>
      )}
      <button type="button" onClick={onDelete} aria-label="Hapus event" title="Hapus event">
        <Trash2 size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

type EventSectionsProps = {
  onCreate: () => void;
  onEdit: (event: EventItem) => void;
  onDelete: (event: EventItem) => void;
};

export function UpcomingEventSection({
  event,
  onCreate,
  onEdit,
  onDelete,
  onMoveToHistory,
}: EventSectionsProps & {
  event: EventItem | null;
  onMoveToHistory: () => void;
}) {
  return (
    <section aria-labelledby="upcoming-heading">
      <div className="section-heading-row">
        <h1 id="upcoming-heading" className="section-title">Event Terdekat:</h1>
        <button type="button" className="add-event" onClick={onCreate} title="Tambah event">
          <Plus size={18} aria-hidden="true" />
          <span>Tambah event</span>
        </button>
      </div>
      {event ? (
        <article className="featured-event">
          <CardActions
            onEdit={() => onEdit(event)}
            onDelete={() => onDelete(event)}
            onMoveToHistory={onMoveToHistory}
          />
          <div className="featured-heading">
            <h2>{event.name}</h2>
            <p className="event-date">
              <CalendarDays size={14} aria-hidden="true" /> {event.date}
            </p>
          </div>
          <div className="featured-content">
            <div className="featured-image-frame">
              <Image
                className="featured-image"
                src={event.image}
                alt={event.name}
                width={800}
                height={500}
                unoptimized
                loading="eager"
              />
            </div>
            <div className="event-description">
              <h3>Tentang Kegiatan</h3>
              <p>{event.description}</p>
              <div className="featured-stats">
                <Info label="Kuota" value={event.capacity} />
                <Info label="Harga Tiket" value={event.price} />
              </div>
            </div>
          </div>
        </article>
      ) : (
        <article className="featured-event featured-empty">
          <CalendarDays size={28} aria-hidden="true" />
          <h2>Belum ada event dalam waktu dekat</h2>
          <p>Event berikutnya akan tampil di sini setelah ditambahkan.</p>
        </article>
      )}
    </section>
  );
}

export function EventHistorySection({
  events,
  onEdit,
  onDelete,
}: Omit<EventSectionsProps, "onCreate"> & { events: EventItem[] }) {
  return (
    <section className="history-section" aria-labelledby="history-heading">
      <h2 id="history-heading" className="section-title history-title">Riwayat Event:</h2>
      <div className="history-list">
        {events.map((event, index) => (
          <article
            className="history-card"
            key={event.id}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <CardActions
              className="history-card-actions"
              onEdit={() => onEdit(event)}
              onDelete={() => onDelete(event)}
            />
            <div className="history-image-frame">
              <Image
                className="history-image"
                src={event.image}
                alt={event.name}
                width={500}
                height={350}
                unoptimized
              />
            </div>
            <div className="history-copy">
              <h3>{event.name}</h3>
              <p className="history-caption event-date">
                <CalendarDays size={13} aria-hidden="true" /> {event.date}
              </p>
              <h4>Tentang Kegiatan</h4>
              <p className="history-description">{event.description}</p>
            </div>
            <div className="history-stats">
              <Info label="Kuota" value={event.capacity} />
              <Info label="Harga Tiket" value={event.price} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
