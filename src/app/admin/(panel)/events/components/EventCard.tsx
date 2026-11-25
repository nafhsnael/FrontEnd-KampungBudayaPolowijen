import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import type { EventRecord } from "@/services/admin-content";

function safePosterStyle(posterUrl: string | null) {
  if (!posterUrl) return undefined;
  try {
    const url = new URL(posterUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return { backgroundImage: `url("${url.href.replace(/["\\]/g, "")}")` };
  } catch {
    return undefined;
  }
}

function formatEventDate(value: string): string {
  if (!value) return "Tanggal belum ditentukan";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
      });
}

function EventActions({
  event,
  onEdit,
  onDelete,
}: {
  event: EventRecord;
  onEdit: (event: EventRecord) => void;
  onDelete: (event: EventRecord) => void;
}) {
  return (
    <div className="absolute right-3 top-3 flex gap-1">
      <button
        type="button"
        onClick={() => onEdit(event)}
        aria-label={`Edit ${event.name}`}
        className="flex h-6 w-6 items-center justify-center rounded-md border border-[#E8DCCB] bg-white text-[#9A7556] hover:bg-[#F4E7D1]"
      >
        <Pencil size={11} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(event)}
        aria-label={`Hapus ${event.name}`}
        className="flex h-6 w-6 items-center justify-center rounded-md border border-[#E8DCCB] bg-white text-[#9A7556] hover:bg-[#FCE9E5] hover:text-[#D26D56]"
      >
        <Trash2 size={11} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function EventCard({
  event,
  featured = false,
  onEdit,
  onDelete,
}: {
  event: EventRecord;
  featured?: boolean;
  onEdit: (event: EventRecord) => void;
  onDelete: (event: EventRecord) => void;
}) {
  return (
    <article
      className={`relative rounded-2xl border border-[#DED5C8] bg-[#FFF9EF] p-3 shadow-[0_2px_8px_rgba(54,39,28,.2)] sm:p-4 ${
        featured ? "" : "flex flex-col gap-3 sm:flex-row sm:items-center"
      }`}
    >
      <EventActions event={event} onEdit={onEdit} onDelete={onDelete} />

      <div className={featured ? "" : "flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center"}>
        <div
          className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E7DED2] bg-gradient-to-br from-[#B77E52] via-[#8A543C] to-[#3E2923] text-[#FFF4DE] shadow-[0_2px_6px_rgba(54,39,28,.18)] ${
            featured
              ? "mb-3 h-36 w-full sm:w-56"
              : "h-28 w-full sm:mb-0 sm:h-28 sm:w-44"
          }`}
          style={{
            ...safePosterStyle(event.posterUrl),
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!event.posterUrl && (
            <>
              <div className="absolute inset-2 rounded-lg border border-white/20" />
              <CalendarDays size={featured ? 36 : 28} strokeWidth={1.2} aria-hidden="true" />
              <span className="absolute bottom-3 text-[8px] font-semibold uppercase tracking-[0.2em] text-white/80">
                Kampung Budaya
              </span>
            </>
          )}
        </div>

        <div className="min-w-0 flex-1 pr-14">
          <h3 className="text-sm font-bold text-[#3F3029]">{event.name}</h3>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#F4E7D1] px-2 py-1 text-[8px] text-[#997346]">
            <CalendarDays size={10} aria-hidden="true" />
            {formatEventDate(event.eventDate)}
          </span>
          <div className="mt-2">
            <p className="text-[9px] font-semibold text-[#4A342A]">
              Tentang Kegiatan
            </p>
            <p className="mt-1 max-w-xl text-[9px] leading-relaxed text-[#82766D]">
              {event.description}
            </p>
          </div>

          {featured ? (
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[9px] text-[#806F62]">
              <p>
                <span className="block text-[#9A8B7D]">Kuota</span>
                <span className="font-semibold text-[#554137]">{event.capacity}</span>
              </p>
              <p>
                <span className="block text-[#9A8B7D]">Harga Tiket</span>
                <span className="font-semibold text-[#554137]">{event.price}</span>
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {!featured ? (
        <div className="ml-auto w-full rounded-xl border border-[#E8DCCB] bg-[#FFFDF8] px-4 py-3 text-[9px] shadow-sm sm:mr-2 sm:w-40">
          <p className="text-[#A68A68]">Kuota</p>
          <p className="font-semibold text-[#967348]">{event.capacity}</p>
          <p className="mt-3 text-[#A68A68]">Harga Tiket</p>
          <p className="font-semibold text-[#967348]">{event.price}</p>
        </div>
      ) : null}
    </article>
  );
}
