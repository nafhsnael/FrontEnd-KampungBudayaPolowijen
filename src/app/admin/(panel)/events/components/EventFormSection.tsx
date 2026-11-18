"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import type { CatalogFormData, EventRecord } from "@/services/admin-content";

type EventFormState = {
  name: string;
  eventDate: string;
  description: string;
  capacity: string;
  price: string;
  posterUrl: string;
};

function makeFormState(event: EventRecord | null): EventFormState {
  return {
    name: event?.name ?? "",
    eventDate: event?.eventDate.slice(0, 10) ?? "",
    description: event?.description ?? "",
    capacity: event?.capacity ?? "",
    price: event?.price ?? "",
    posterUrl: event?.posterUrl ?? "",
  };
}

export default function EventFormSection({
  isOpen,
  event,
  saving,
  error,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  event: EventRecord | null;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (data: CatalogFormData, posterFile: File | null) => void;
}) {
  const [form, setForm] = useState<EventFormState>(() => makeFormState(event));
  const [posterFile, setPosterFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(makeFormState(event));
      setPosterFile(null);
    }
  }, [event, isOpen]);

  if (!isOpen) return null;

  function updateField(key: keyof EventFormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(submitEvent: FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    onSave(
      {
        ...form,
        status: event?.status ?? "Upcoming",
      },
      posterFile
    );
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#211610]/60 p-4"
      role="presentation"
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === mouseEvent.currentTarget && !saving) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-form-title"
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-[#E6DCC9] bg-[#FFF9EF] p-4 shadow-[0_8px_30px_rgba(48,31,20,.25)]"
      >
        <header className="mb-4 flex items-center justify-between">
          <h2 id="event-form-title" className="text-base font-bold text-[#4A291F]">
            {event ? "Edit Event" : "Tambah Event"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Tutup formulir"
            className="rounded-full p-1 text-[#806B5C] hover:bg-[#F3E9DA] disabled:opacity-50"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        {error && (
          <p role="alert" className="mb-3 rounded-md bg-[#FFF0ED] px-3 py-2 text-xs text-[#9B3D32]">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs text-[#75685F]">Nama event</span>
            <input
              required
              maxLength={150}
              value={form.name}
              onChange={(eventChange) => updateField("name", eventChange.target.value)}
              className="h-9 w-full rounded-md border border-[#E2D9CB] bg-white px-3 text-sm text-[#4A342A] outline-none focus:border-[#C49A4A]"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs text-[#75685F]">Tanggal kegiatan</span>
            <input
              required
              type="date"
              value={form.eventDate}
              onChange={(eventChange) => updateField("eventDate", eventChange.target.value)}
              className="h-9 w-full rounded-md border border-[#E2D9CB] bg-white px-3 text-sm text-[#4A342A] outline-none focus:border-[#C49A4A]"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs text-[#75685F]">Tentang kegiatan</span>
            <textarea
              rows={3}
              maxLength={5000}
              value={form.description}
              onChange={(eventChange) => updateField("description", eventChange.target.value)}
              className="w-full rounded-md border border-[#E2D9CB] bg-white px-3 py-2 text-sm text-[#4A342A] outline-none focus:border-[#C49A4A]"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs text-[#75685F]">Unggah gambar</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              onChange={(eventChange) => setPosterFile(eventChange.target.files?.[0] ?? null)}
              className="w-full rounded-md border border-[#E2D9CB] bg-white px-2 py-2 text-xs text-[#4A342A] file:mr-2 file:rounded file:border-0 file:bg-[#F3E9DA] file:px-2 file:py-1 file:text-xs file:text-[#4A342A]"
            />
            <span className="mt-1 block text-[10px] text-[#8C8178]">
              {posterFile
                ? `${posterFile.name} akan diunggah ke Vercel Blob.`
                : form.posterUrl
                  ? "Poster lama dipertahankan jika tidak memilih file baru."
                  : "Pilih file gambar dari perangkat (maksimal 5 MB)."}
            </span>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs text-[#75685F]">Kuota</span>
              <input
                value={form.capacity}
                maxLength={100}
                onChange={(eventChange) => updateField("capacity", eventChange.target.value)}
                className="h-9 w-full rounded-md border border-[#E2D9CB] bg-white px-3 text-sm text-[#4A342A] outline-none focus:border-[#C49A4A]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-[#75685F]">Harga tiket</span>
              <input
                value={form.price}
                maxLength={100}
                onChange={(eventChange) => updateField("price", eventChange.target.value)}
                className="h-9 w-full rounded-md border border-[#E2D9CB] bg-white px-3 text-sm text-[#4A342A] outline-none focus:border-[#C49A4A]"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-md bg-[#4A291F] text-sm font-semibold text-white hover:bg-[#633A2D] disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : event ? "Simpan perubahan" : "Simpan event"}
          </button>
        </form>
      </section>
    </div>
  );
}
