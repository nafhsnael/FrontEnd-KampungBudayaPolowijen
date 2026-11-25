"use client";

import EventFormSection from "./components/EventFormSection";
import EventHeaderSection from "./components/EventHeaderSection";
import EventHistorySection from "./components/EventHistorySection";
import NearestEventSection from "./components/NearestEventSection";
import useEventsManager from "./hooks/useEventsManager";

export default function AdminEventsPage() {
  const events = useEventsManager();

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <EventHeaderSection onCreate={events.openCreateForm} />
      {events.error && (
        <p role="alert" className="rounded-md bg-[#FFF0ED] px-3 py-2 text-sm text-[#9B3D32]">
          {events.error}
        </p>
      )}
      {events.loading && (
        <p className="text-sm text-[#82766D]">Memuat daftar event...</p>
      )}
      <NearestEventSection
        events={events.nearestEvent}
        onEdit={events.openEditForm}
        onDelete={(event) => void events.removeEvent(event)}
      />
      <EventHistorySection
        events={events.historyEvents}
        onEdit={events.openEditForm}
        onDelete={(event) => void events.removeEvent(event)}
      />
      <EventFormSection
        isOpen={events.formOpen}
        event={events.editingEvent}
        saving={events.saving}
        error={events.dialogError}
        onClose={events.closeForm}
        onSave={events.saveEvent}
      />
      {events.deleteTarget && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#211610]/55 p-4"
          role="presentation"
          onMouseDown={(mouseEvent) => {
            if (mouseEvent.target === mouseEvent.currentTarget && !events.deleting) {
              events.cancelDeleteEvent();
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-event-title"
            aria-describedby="delete-event-description"
            className="w-full max-w-[340px] rounded-xl border border-[#E6DCC9] bg-[#FFF9EF] p-5 shadow-[0_12px_40px_rgba(48,31,20,.28)]"
          >
            <h2 id="delete-event-title" className="text-lg font-bold text-[#4A291F]">
              Hapus event?
            </h2>
            <p
              id="delete-event-description"
              className="mt-2 text-[11px] leading-relaxed text-[#82776D]"
            >
              Event &ldquo;{events.deleteTarget.name}&rdquo; akan dihapus dari daftar.
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={events.cancelDeleteEvent}
                disabled={events.deleting}
                className="h-8 rounded-md border border-[#E2D9CB] px-3 text-[10px] text-[#77685C] hover:bg-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => void events.confirmDeleteEvent()}
                disabled={events.deleting}
                className="h-8 rounded-md bg-[#A83B32] px-4 text-[10px] font-semibold text-white hover:bg-[#8F3028] disabled:opacity-60"
              >
                {events.deleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
