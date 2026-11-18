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
        event={events.nearestEvent}
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
    </section>
  );
}
