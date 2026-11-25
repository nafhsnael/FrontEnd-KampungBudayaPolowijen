import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteEventItem,
  EventRecord,
  fetchEventItems,
  saveEventItem,
  type CatalogFormData,
} from "@/services/admin-content";

export default function useEventsManager() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EventRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEvents(await fetchEventItems());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Gagal memuat data event."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const { nearestEvent, historyEvents } = useMemo(() => {
    const nearestEvents = events
      .filter((event) => event.status !== "Completed")
      .sort((left, right) => left.eventDate.localeCompare(right.eventDate));

    return {
      nearestEvent: nearestEvents,
      historyEvents: events
        .filter((event) => event.status === "Completed")
        .sort((left, right) => right.eventDate.localeCompare(left.eventDate)),
    };
  }, [events]);

  function openCreateForm() {
    setEditingEvent(null);
    setDialogError(null);
    setFormOpen(true);
  }

  function openEditForm(event: EventRecord) {
    setEditingEvent(event);
    setDialogError(null);
    setFormOpen(true);
  }

  async function saveEvent(data: CatalogFormData, posterFile: File | null) {
    setSaving(true);
    setDialogError(null);
    try {
      await saveEventItem(
        editingEvent?.id ?? null,
        {
          ...data,
          status: data.status ?? editingEvent?.status ?? "Upcoming",
        },
        posterFile
      );
      setFormOpen(false);
      await loadEvents();
    } catch (saveError) {
      setDialogError(
        saveError instanceof Error ? saveError.message : "Gagal menyimpan event."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeEvent(event: EventRecord) {
    setDeleteTarget(event);
  }

  async function confirmDeleteEvent() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteEventItem(deleteTarget.id);
      setDeleteTarget(null);
      await loadEvents();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus event."
      );
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return {
    nearestEvent,
    historyEvents,
    loading,
    saving,
    error,
    dialogError,
    formOpen,
    editingEvent,
    deleteTarget,
    deleting,
    openCreateForm,
    openEditForm,
    saveEvent,
    removeEvent,
    confirmDeleteEvent,
    cancelDeleteEvent: () => setDeleteTarget(null),
    closeForm: () => setFormOpen(false),
  };
}
