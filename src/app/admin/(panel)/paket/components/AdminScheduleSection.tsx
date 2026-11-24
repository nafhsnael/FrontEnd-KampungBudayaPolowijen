"use client";

import { useEffect, useState } from "react";
import {
  deleteRoutineSchedule,
  fetchRoutineSchedules,
  RoutineScheduleRecord,
  saveRoutineSchedule,
} from "@/services/admin-content";
import {
  Modal,
  PackageImage,
  TrashIcon,
  inputClass,
  labelClass,
} from "./adminShared";

const DAYS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
] as const;

type Schedule = {
  id: string;
  name: string;
  day: string;
  startTime: string; // format "19:00"
  endTime: string; // format "21:00"
  description: string;
  capacity: string;
  price: string;
  image: string;
};

function toSchedule(item: RoutineScheduleRecord): Schedule {
  return {
    id: item.id,
    name: item.name,
    day: item.day,
    startTime: item.startTime ?? "",
    endTime: item.endTime ?? "",
    description: item.description,
    capacity: item.capacity,
    price: item.price,
    image: item.imageUrl ?? "",
  };
}

const formatTime = (t: string) => t.replace(":", ".");
const formatRange = (s: Schedule) =>
  s.startTime && s.endTime
    ? `${formatTime(s.startTime)}-${formatTime(s.endTime)} WIB`
    : "Waktu belum ditentukan";

type ModalState =
  | { type: "edit" | "delete"; id: string }
  | { type: "create" }
  | null;

/* ---------- Edit / create modal ---------- */

function ScheduleModal({
  item,
  onSave,
  onClose,
}: {
  item: Schedule | null; // null = jadwal baru
  onSave: (saved: Schedule, imageFile: File | null) => Promise<void>;
  onClose: () => void;
}) {
  const isNew = item === null;
  const [name, setName] = useState(item?.name ?? "");
  const [day, setDay] = useState(item?.day ?? "Jumat");
  const [startTime, setStartTime] = useState(item?.startTime ?? "");
  const [endTime, setEndTime] = useState(item?.endTime ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [image, setImage] = useState(item?.image ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!image.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(image);
  }, [image]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setFileName(file.name);
    setImage(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(
        {
          id: item?.id ?? `jadwal-${Date.now()}`,
          name: name.trim(),
          day,
          startTime,
          endTime,
          description: description.trim(),
          capacity: item?.capacity ?? "",
          price: item?.price ?? "",
          image,
        },
        imageFile
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Gagal menyimpan jadwal."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={isNew ? "Tambah Jadwal" : "Edit Jadwal"}
      onClose={onClose}
      showClose
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <p role="alert" className="rounded-md bg-[#FFF0ED] px-3 py-2 text-xs text-[#9B3D32]">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="sch-name" className={labelClass}>
            Nama kegiatan
          </label>
          <input
            id="sch-name"
            required
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="sch-day" className={labelClass}>
            Hari kegiatan
          </label>
          <select
            id="sch-day"
            className={inputClass}
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="sch-start" className={labelClass}>
              Jam mulai
            </label>
            <input
              id="sch-start"
              type="time"
              required
              className={inputClass}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="sch-end" className={labelClass}>
              Jam selesai
            </label>
            <input
              id="sch-end"
              type="time"
              required
              className={inputClass}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="sch-desc" className={labelClass}>
            Tentang kegiatan
          </label>
          <textarea
            id="sch-desc"
            rows={3}
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="sch-image" className={labelClass}>
            Gambar kegiatan
          </label>
          <div className="flex items-center gap-2 rounded-md border border-[#E7D9C4] bg-white px-2 py-1.5 text-xs text-[#3b2a22]">
            <input
              id="sch-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              onChange={handleFile}
              className="w-full text-xs file:mr-2 file:rounded file:border-0 file:bg-[#EFE3CF] file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-[#4A2A20] hover:file:bg-[#E7D9C4]"
            />
          </div>
          {fileName && (
            <p className="mt-1 text-[11px] text-[#4A2A20]/70">
              {fileName} akan diunggah ke Cloudinary.
            </p>
          )}
          {!fileName && image && (
            <p className="mt-1 text-[11px] text-[#4A2A20]/70">
              Gambar lama dipertahankan jika tidak memilih file baru.
            </p>
          )}
        </div>

        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-lg bg-[#d9c7b0]">
          <PackageImage src={image} alt="Pratinjau gambar kegiatan" sizes="360px" />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-[#4A2A20] py-2.5 text-sm font-semibold text-white transition hover:bg-[#6a3d2e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8933F] disabled:cursor-wait disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : isNew ? "Simpan jadwal" : "Simpan perubahan"}
        </button>
      </form>
    </Modal>
  );
}

/* ---------- Delete confirmation ---------- */

function DeleteScheduleModal({
  item,
  onConfirm,
  onClose,
}: {
  item: Schedule;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal title="Hapus jadwal?" onClose={onClose}>
      <p className="text-sm text-[#3b2a22]">
        Jadwal <strong>{item.name}</strong> akan dihapus dan tidak bisa
        dikembalikan.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="rounded-lg border border-[#4A2A20] py-2.5 text-sm font-semibold text-[#4A2A20] transition hover:bg-[#4A2A20]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8933F]"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-[#B5483A] py-2.5 text-sm font-semibold text-white transition hover:bg-[#9c3b2e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5483A]"
        >
          Hapus jadwal
        </button>
      </div>
    </Modal>
  );
}

/* ---------- Kartu jadwal ---------- */

function ScheduleCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Schedule;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const iconButton =
    "flex h-7 w-7 items-center justify-center rounded-lg border border-[#E7D9C4] bg-[#FFF8EC] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8933F]";

  return (
    <article className="relative flex flex-col gap-4 rounded-3xl border border-[#E7D9C4] bg-[#FFF8EC] p-4 shadow-[0_4px_14px_rgba(74,42,32,0.2)] sm:flex-row sm:items-center sm:gap-5">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl bg-[#d9c7b0] sm:h-[110px] sm:w-[180px] sm:aspect-auto">
        <PackageImage
          src={item.image}
          alt={`Foto kegiatan ${item.name}`}
          sizes="180px"
        />
      </div>

      <div className="min-w-0 flex-1 sm:pr-24">
        <h3 className="text-base font-bold text-[#3b2a22]">{item.name}</h3>
        <span className="mt-1.5 inline-block rounded-full bg-[#F4E7D1] px-2.5 py-0.5 text-[11px] font-medium text-[#8a5a2b]">
          Setiap {item.day}, {formatRange(item)}
        </span>
        <p className="mt-2 text-xs font-bold text-[#3b2a22]">Tentang Kegiatan</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-[#4A2A20]/80">
          {item.description || "Belum ada deskripsi kegiatan."}
        </p>
      </div>

      <div className="rounded-2xl border border-[#E7D9C4] bg-[#FFF8EC] px-4 py-3 text-xs text-[#3b2a22] shadow-[0_2px_8px_rgba(74,42,32,0.18)] sm:mt-8 sm:w-[150px] sm:shrink-0">
        <p className="text-[10px] text-[#4A2A20]/60">Hari</p>
        <p className="font-bold">{item.day}</p>
        <p className="mt-2 text-[10px] text-[#4A2A20]/60">Jam</p>
        <p className="font-bold">{formatRange(item)}</p>
      </div>

      <div className="absolute right-4 top-4 flex gap-1.5">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit jadwal ${item.name}`}
          className={`${iconButton} text-[#4A2A20]`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Hapus jadwal ${item.name}`}
          className={`${iconButton} text-[#B5483A]`}
        >
          <TrashIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}

/* ---------- Main section ---------- */

export default function AdminScheduleSection() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [modal, setModal] = useState<ModalState>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchRoutineSchedules()
      .then((items) => {
        if (active) setSchedules(items.map(toSchedule));
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error ? loadError.message : "Gagal memuat jadwal rutin."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const modalItem =
    modal && modal.type !== "create"
      ? schedules.find((s) => s.id === modal.id)
      : undefined;

  const closeModal = () => setModal(null);

  const handleSave = async (saved: Schedule, imageFile: File | null) => {
    const exists = schedules.some((schedule) => schedule.id === saved.id);
    setError(null);
    const savedRecord = await saveRoutineSchedule(
      exists ? saved.id : null,
      {
        name: saved.name,
        day: saved.day,
        startTime: saved.startTime,
        endTime: saved.endTime,
        description: saved.description,
        capacity: saved.capacity,
        price: saved.price,
        imageUrl: imageFile
          ? schedules.find((schedule) => schedule.id === saved.id)?.image ?? null
          : saved.image || null,
      },
      imageFile
    );
    const updatedSchedule = toSchedule(savedRecord);
    setSchedules((list) =>
      exists
        ? list.map((schedule) => schedule.id === saved.id ? updatedSchedule : schedule)
        : [...list, updatedSchedule]
    );
    closeModal();
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteRoutineSchedule(id);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Gagal menghapus jadwal."
      );
      closeModal();
      return;
    }
    setSchedules((list) => list.filter((s) => s.id !== id));
    closeModal();
  };

  // Kelompokkan per hari, urut Senin sampai Minggu; di dalam hari urut jam mulai
  const groups = DAYS.map((day) => ({
    day,
    items: schedules
      .filter((s) => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="flex justify-end pt-6">
        <button
          type="button"
          disabled={loading}
          onClick={() => setModal({ type: "create" })}
          className="flex items-center gap-2 rounded-xl bg-[#4A2A20] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#6a3d2e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8933F] disabled:cursor-wait disabled:opacity-60"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Tambah Jadwal
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-md bg-[#FFF0ED] px-3 py-2 text-sm text-[#9B3D32]">
          {error}
        </p>
      )}

      {loading && (
        <p className="py-6 text-center text-sm text-[#4A2A20]/70">
          Memuat jadwal rutin...
        </p>
      )}

      {schedules.length === 0 ? (
        !loading && !error ? (
          <div className="py-20 text-center text-sm text-[#4A2A20]/70">
            Belum ada jadwal rutin. Klik &quot;Tambah Jadwal&quot; untuk membuat
            jadwal pertama.
          </div>
        ) : null
      ) : (
        <div className="space-y-6 py-4">
          {groups.map(({ day, items }) => (
            <section key={day} aria-label={`Jadwal hari ${day}`}>
              <h2 className="mb-3 text-base font-bold text-[#3b2a22]">{day}:</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <ScheduleCard
                    key={item.id}
                    item={item}
                    onEdit={() => setModal({ type: "edit", id: item.id })}
                    onDelete={() => setModal({ type: "delete", id: item.id })}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {modal?.type === "create" && (
        <ScheduleModal item={null} onSave={handleSave} onClose={closeModal} />
      )}

      {modal?.type === "edit" && modalItem && (
        <ScheduleModal item={modalItem} onSave={handleSave} onClose={closeModal} />
      )}

      {modal?.type === "delete" && modalItem && (
        <DeleteScheduleModal
          item={modalItem}
          onConfirm={() => void handleDelete(modalItem.id)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}