"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  RefreshCw,
  Ticket,
  Trash2,
  X,
} from "lucide-react";
import {
  deletePackageItem,
  deleteRoutineSchedule,
  fetchPackageItems,
  fetchRoutineSchedules,
  PackageRecord,
  RoutineScheduleFormData,
  RoutineScheduleRecord,
  savePackageItem,
  saveRoutineSchedule,
} from "@/services/admin-content";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"] as const;

type PackageForm = {
  name: string;
  description: string;
  duration: string;
  capacity: string;
  price: string;
  imageUrl: string;
  isActive: boolean;
};

type ScheduleForm = RoutineScheduleFormData;
type DeleteTarget = {
  kind: "package" | "schedule";
  id: string;
  name: string;
};

const EMPTY_PACKAGE: PackageForm = {
  name: "",
  description: "",
  duration: "",
  capacity: "",
  price: "0",
  imageUrl: "",
  isActive: true,
};

const EMPTY_SCHEDULE: ScheduleForm = {
  name: "",
  day: "Jumat",
  description: "",
  capacity: "",
  price: "",
  imageUrl: null,
};

function packageForm(item?: PackageRecord): PackageForm {
  if (!item) return EMPTY_PACKAGE;
  return {
    name: item.name,
    description: item.description,
    duration: item.duration,
    capacity: item.capacity,
    price: String(item.price),
    imageUrl: item.imageUrl ?? "",
    isActive: item.isActive,
  };
}

function scheduleForm(item?: RoutineScheduleRecord): ScheduleForm {
  if (!item) return EMPTY_SCHEDULE;
  return {
    name: item.name,
    day: item.day,
    description: item.description,
    capacity: item.capacity,
    price: item.price,
    imageUrl: item.imageUrl,
  };
}

function safeImageStyle(imageUrl: string | null | undefined) {
  if (!imageUrl) return undefined;
  try {
    const url = new URL(imageUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return { backgroundImage: `url("${url.href.replace(/["\\]/g, "")}")` };
  } catch {
    return undefined;
  }
}

function formatPrice(value: number | string): string {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return String(value || "Harga belum ditentukan");
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numericValue);
}

export default function AdminPackagePage() {
  const [tab, setTab] = useState<"packages" | "routine">("packages");
  const [packages, setPackages] = useState<PackageRecord[]>([]);
  const [schedules, setSchedules] = useState<RoutineScheduleRecord[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [schedulesLoading, setSchedulesLoading] = useState(true);
  const [packagesError, setPackagesError] = useState<string | null>(null);
  const [schedulesError, setSchedulesError] = useState<string | null>(null);
  const [packageDialogOpen, setPackageDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageRecord | null>(null);
  const [editingSchedule, setEditingSchedule] =
    useState<RoutineScheduleRecord | null>(null);
  const [packageFormState, setPackageFormState] =
    useState<PackageForm>(EMPTY_PACKAGE);
  const [scheduleFormState, setScheduleFormState] =
    useState<ScheduleForm>(EMPTY_SCHEDULE);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPackages = useCallback(async () => {
    setPackagesLoading(true);
    setPackagesError(null);
    try {
      const result = await fetchPackageItems();
      setPackages(result);
      setSelectedPackageId((current) =>
        result.some((item) => item.id === current)
          ? current
          : result[0]?.id ?? null
      );
    } catch (error) {
      setPackagesError(
        error instanceof Error ? error.message : "Gagal memuat paket kunjungan."
      );
    } finally {
      setPackagesLoading(false);
    }
  }, []);

  const loadSchedules = useCallback(async () => {
    setSchedulesLoading(true);
    setSchedulesError(null);
    try {
      setSchedules(await fetchRoutineSchedules());
    } catch (error) {
      setSchedulesError(
        error instanceof Error ? error.message : "Gagal memuat jadwal rutin."
      );
    } finally {
      setSchedulesLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchPackageItems()
      .then((result) => {
        if (!active) return;
        setPackages(result);
        setSelectedPackageId(result[0]?.id ?? null);
      })
      .catch((error: unknown) => {
        if (active) {
          setPackagesError(
            error instanceof Error ? error.message : "Gagal memuat paket kunjungan."
          );
        }
      })
      .finally(() => {
        if (active) setPackagesLoading(false);
      });

    fetchRoutineSchedules()
      .then((result) => {
        if (active) setSchedules(result);
      })
      .catch((error: unknown) => {
        if (active) {
          setSchedulesError(
            error instanceof Error ? error.message : "Gagal memuat jadwal rutin."
          );
        }
      })
      .finally(() => {
        if (active) setSchedulesLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const activeIndex = Math.max(
    0,
    packages.findIndex((item) => item.id === selectedPackageId)
  );
  const visiblePackages = useMemo(() => {
    if (packages.length === 0) return [];
    const offsets =
      packages.length >= 5
        ? [-2, -1, 0, 1, 2]
        : packages.length === 4
          ? [-1, 0, 1, 2]
          : packages.length === 3
            ? [-1, 0, 1]
            : packages.length === 2
              ? [-1, 0]
              : [0];
    return offsets.map(
      (offset) => packages[(activeIndex + offset + packages.length) % packages.length]
    );
  }, [activeIndex, packages]);
  const activePackage = packages[activeIndex];

  function moveSelection(direction: -1 | 1) {
    if (packages.length < 2) return;
    const nextIndex = (activeIndex + direction + packages.length) % packages.length;
    setSelectedPackageId(packages[nextIndex].id);
  }

  function openCreatePackage() {
    setEditingPackage(null);
    setPackageFormState(EMPTY_PACKAGE);
    setDialogError(null);
    setPackageDialogOpen(true);
  }

  function openEditPackage(item: PackageRecord) {
    setEditingPackage(item);
    setPackageFormState(packageForm(item));
    setDialogError(null);
    setPackageDialogOpen(true);
  }

  function openCreateSchedule() {
    setEditingSchedule(null);
    setScheduleFormState(EMPTY_SCHEDULE);
    setDialogError(null);
    setScheduleDialogOpen(true);
  }

  function openEditSchedule(item: RoutineScheduleRecord) {
    setEditingSchedule(item);
    setScheduleFormState(scheduleForm(item));
    setDialogError(null);
    setScheduleDialogOpen(true);
  }

  async function submitPackage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setDialogError(null);
    try {
      await savePackageItem(editingPackage?.id ?? null, {
        ...packageFormState,
        price: Number(packageFormState.price),
        imageUrl: packageFormState.imageUrl.trim() || null,
      });
      setPackageDialogOpen(false);
      await loadPackages();
    } catch (error) {
      setDialogError(
        error instanceof Error ? error.message : "Gagal menyimpan paket."
      );
    } finally {
      setSaving(false);
    }
  }

  async function submitSchedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setDialogError(null);
    try {
      await saveRoutineSchedule(editingSchedule?.id ?? null, {
        ...scheduleFormState,
        name: scheduleFormState.name.trim(),
        description: scheduleFormState.description.trim(),
        capacity: scheduleFormState.capacity.trim(),
        price: scheduleFormState.price.trim(),
        imageUrl: scheduleFormState.imageUrl?.trim() || null,
      });
      setScheduleDialogOpen(false);
      await loadSchedules();
    } catch (error) {
      setDialogError(
        error instanceof Error ? error.message : "Gagal menyimpan jadwal rutin."
      );
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.kind === "package") {
        await deletePackageItem(deleteTarget.id);
        setPackageDialogOpen(false);
        await loadPackages();
      } else {
        await deleteRoutineSchedule(deleteTarget.id);
        await loadSchedules();
      }
      setDeleteTarget(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus data.";
      if (deleteTarget.kind === "package") setPackagesError(message);
      else setSchedulesError(message);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  const schedulesByDay = DAYS.map((day) => ({
    day,
    items: schedules.filter((item) => item.day === day),
  })).filter((group) => group.items.length > 0);

  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-1 flex border-b border-[#CDBCA7]">
        <button
          type="button"
          onClick={() => setTab("packages")}
          className={`min-h-8 flex-1 px-3 text-[9px] font-semibold transition ${
            tab === "packages"
              ? "bg-[#4A291F] text-white"
              : "bg-transparent text-[#5D4639] hover:bg-[#F5EBDD]"
          }`}
        >
          Paket Kunjungan
        </button>
        <button
          type="button"
          onClick={() => setTab("routine")}
          className={`min-h-8 flex-1 px-3 text-[9px] font-semibold transition ${
            tab === "routine"
              ? "bg-[#4A291F] text-white"
              : "bg-transparent text-[#5D4639] hover:bg-[#F5EBDD]"
          }`}
        >
          Jadwal Rutin
        </button>
      </div>

      {tab === "packages" ? (
        <section className="mx-auto max-w-[820px]">
          <div className="mb-1 flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => void loadPackages()}
              disabled={packagesLoading}
              aria-label="Muat ulang paket"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E1D6C7] text-[#8A6D57] hover:bg-white disabled:opacity-50"
            >
              <RefreshCw size={10} className={packagesLoading ? "animate-spin" : ""} aria-hidden="true" />
            </button>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={openCreatePackage}
                aria-label="Tambah paket"
                title="Tambah paket"
                className="inline-flex h-6 items-center gap-1 rounded-full bg-[#4A291F] px-2.5 text-[7px] font-semibold text-white hover:bg-[#633A2D]"
              >
                <Plus size={10} aria-hidden="true" />
                Tambah
              </button>
            </div>
          </div>

          {packagesError && (
            <p role="alert" className="mb-3 rounded-md bg-[#FFF0ED] px-3 py-2 text-[9px] text-[#9B3D32]">
              {packagesError}
            </p>
          )}

          {packagesLoading ? (
            <p className="py-12 text-center text-[9px] text-[#8D8278]">
              Memuat paket kunjungan...
            </p>
          ) : packages.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D8C8B3] bg-white/70 px-4 py-10 text-center">
              <Ticket size={20} className="mx-auto mb-2 text-[#B78C59]" aria-hidden="true" />
              <p className="text-[10px] font-semibold text-[#5D4639]">
                Belum ada paket kunjungan.
              </p>
              <p className="mt-1 text-[8px] text-[#92877D]">
                Tambahkan paket agar tampil di daftar ini.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => moveSelection(-1)}
                aria-label="Paket sebelumnya"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4A291F] text-[#FFF8EC] hover:bg-[#633A2D]"
              >
                <ChevronLeft size={15} aria-hidden="true" />
              </button>
              <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 overflow-hidden py-3 sm:gap-2.5">
                {visiblePackages.map((item, index) => {
                  const active = item.id === activePackage?.id;
                  const distance = Math.abs(index - Math.floor(visiblePackages.length / 2));
                  const detailItems = item.description
                    .split(/\r?\n/)
                    .map((detail) => detail.trim())
                    .filter(Boolean)
                    .slice(0, active ? 5 : 2);
                  return (
                    <article
                      key={item.id}
                      className={`relative flex shrink-0 flex-col overflow-hidden rounded-xl border p-2 transition-all ${
                        active
                          ? "min-h-[254px] w-[132px] translate-y-[-3px] border-[#573629] bg-[#4A291F] text-[#FFF1D6] shadow-[0_6px_15px_rgba(54,34,25,.25)] sm:min-h-[286px] sm:w-[164px]"
                          : distance === 1
                            ? "min-h-[218px] w-[94px] border-[#D9CCBB] bg-[#FFFCF6] text-[#514137] shadow-[0_2px_7px_rgba(54,34,25,.12)] sm:min-h-[232px] sm:w-[126px]"
                            : "min-h-[172px] w-[66px] border-[#D9CCBB] bg-[#FFFCF6] text-[#514137] shadow-[0_2px_7px_rgba(54,34,25,.12)] sm:min-h-[188px] sm:w-[82px]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedPackageId(item.id)}
                        className="text-left"
                        aria-pressed={active}
                      >
                        <div
                          className={`mb-2 rounded-lg border border-[#E9D7BB]/60 bg-[#E9D7BB] bg-cover bg-center ${
                            active
                              ? "h-[82px] sm:h-[96px]"
                              : distance === 1
                                ? "h-[62px] sm:h-[72px]"
                                : "h-[48px] sm:h-[54px]"
                          }`}
                          style={safeImageStyle(item.imageUrl)}
                        />
                        <h2 className={`line-clamp-2 font-bold ${active ? "text-[9px] sm:text-[10px]" : "text-[7px]"}`}>
                          {item.name}
                        </h2>
                        <p className={`mt-1 text-[7px] font-semibold ${active ? "text-[#F3D28F]" : "text-[#94724F]"}`}>
                          {formatPrice(item.price)} / orang
                        </p>
                        {active ? (
                          <ul className="mt-2 space-y-1 text-left text-[6px] leading-relaxed text-[#E9D9BD] sm:text-[7px]">
                            {(detailItems.length > 0
                              ? detailItems
                              : ["Detail kegiatan belum ditambahkan."]
                            ).map((detail, detailIndex) => (
                              <li key={`${item.id}-${detailIndex}`} className="flex gap-1">
                                <span aria-hidden="true">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-1 line-clamp-2 text-[6px] leading-relaxed text-[#8D8176]">
                            {detailItems[0] || "Paket kunjungan"}
                          </p>
                        )}
                      </button>
                      {active && (
                        <button
                          type="button"
                          onClick={() => openEditPackage(item)}
                          className="mt-auto inline-flex h-6 items-center justify-center gap-1 rounded-full bg-[#C7983D] px-2 text-[7px] font-semibold text-white hover:bg-[#A98136] sm:h-7 sm:text-[8px]"
                        >
                          <Pencil size={9} aria-hidden="true" />
                          Edit Paket
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => moveSelection(1)}
                aria-label="Paket berikutnya"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4A291F] text-[#FFF8EC] hover:bg-[#633A2D]"
              >
                <ChevronRight size={15} aria-hidden="true" />
              </button>
            </div>
          )}

          {activePackage && (
            <p className="mt-1 text-center text-[7px] text-[#8D8278]">
              {activeIndex + 1} dari {packages.length} paket
            </p>
          )}
        </section>
      ) : (
        <RoutineScheduleView
          schedules={schedules}
          groups={schedulesByDay}
          loading={schedulesLoading}
          error={schedulesError}
          onRefresh={() => void loadSchedules()}
          onCreate={openCreateSchedule}
          onEdit={openEditSchedule}
          onDelete={(item) =>
            setDeleteTarget({ kind: "schedule", id: item.id, name: item.name })
          }
        />
      )}

      {packageDialogOpen && (
        <Modal
          eyebrow="PAKET KUNJUNGAN"
          title={editingPackage ? "Edit Paket" : "Tambah Paket"}
          onClose={() => setPackageDialogOpen(false)}
        >
          <form onSubmit={submitPackage} className="space-y-2.5">
            <SmallField label="Nama paket">
              <input
                required
                value={packageFormState.name}
                onChange={(event) =>
                  setPackageFormState((current) => ({ ...current, name: event.target.value }))
                }
                className={inputClassName}
              />
            </SmallField>
            <div className="grid grid-cols-2 gap-2">
              <SmallField label="Durasi">
                <input
                  value={packageFormState.duration}
                  onChange={(event) =>
                    setPackageFormState((current) => ({ ...current, duration: event.target.value }))
                  }
                  className={inputClassName}
                />
              </SmallField>
              <SmallField label="Kapasitas">
                <input
                  value={packageFormState.capacity}
                  onChange={(event) =>
                    setPackageFormState((current) => ({ ...current, capacity: event.target.value }))
                  }
                  className={inputClassName}
                />
              </SmallField>
            </div>
            <SmallField label="Harga">
              <input
                required
                type="number"
                min="0"
                step="1"
                value={packageFormState.price}
                onChange={(event) =>
                  setPackageFormState((current) => ({ ...current, price: event.target.value }))
                }
                className={inputClassName}
              />
            </SmallField>
            <SmallField label="Isi paket (tulis satu kegiatan per baris)">
              <textarea
                rows={5}
                value={packageFormState.description}
                onChange={(event) =>
                  setPackageFormState((current) => ({ ...current, description: event.target.value }))
                }
                className={textareaClassName}
              />
            </SmallField>
            <SmallField label="Gambar untuk paket · URL gambar">
              <input
                type="url"
                value={packageFormState.imageUrl}
                onChange={(event) =>
                  setPackageFormState((current) => ({ ...current, imageUrl: event.target.value }))
                }
                className={inputClassName}
              />
            </SmallField>
            <div
              className="h-20 rounded-lg border border-[#E6DDD0] bg-[#F3E9D8] bg-cover bg-center"
              style={safeImageStyle(packageFormState.imageUrl)}
              aria-label={packageFormState.imageUrl ? "Pratinjau gambar paket" : undefined}
            />
            <label className="flex items-center gap-2 text-[8px] text-[#69584C]">
              <input
                type="checkbox"
                checked={packageFormState.isActive}
                onChange={(event) =>
                  setPackageFormState((current) => ({ ...current, isActive: event.target.checked }))
                }
                className="accent-[#A98543]"
              />
              Paket aktif
            </label>
            {dialogError && <FormError>{dialogError}</FormError>}
            <ModalActions
              saving={saving}
              onCancel={() => setPackageDialogOpen(false)}
              label={editingPackage ? "Simpan perubahan" : "Simpan paket"}
              onDelete={
                editingPackage
                  ? () =>
                      setDeleteTarget({
                        kind: "package",
                        id: editingPackage.id,
                        name: editingPackage.name,
                      })
                  : undefined
              }
            />
          </form>
        </Modal>
      )}

      {scheduleDialogOpen && (
        <Modal
          eyebrow="JADWAL RUTIN"
          title={editingSchedule ? "Edit Jadwal" : "Tambah Jadwal"}
          onClose={() => setScheduleDialogOpen(false)}
        >
          <form onSubmit={submitSchedule} className="space-y-2.5">
            <SmallField label="Nama kegiatan">
              <input
                required
                value={scheduleFormState.name}
                onChange={(event) =>
                  setScheduleFormState((current) => ({ ...current, name: event.target.value }))
                }
                className={inputClassName}
              />
            </SmallField>
            <SmallField label="Hari kegiatan">
              <select
                value={scheduleFormState.day}
                onChange={(event) =>
                  setScheduleFormState((current) => ({ ...current, day: event.target.value }))
                }
                className={inputClassName}
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </SmallField>
            <SmallField label="Tentang kegiatan">
              <textarea
                rows={3}
                value={scheduleFormState.description}
                onChange={(event) =>
                  setScheduleFormState((current) => ({ ...current, description: event.target.value }))
                }
                className={textareaClassName}
              />
            </SmallField>
            <SmallField label="URL gambar">
              <input
                type="url"
                value={scheduleFormState.imageUrl ?? ""}
                onChange={(event) =>
                  setScheduleFormState((current) => ({
                    ...current,
                    imageUrl: event.target.value || null,
                  }))
                }
                className={inputClassName}
              />
            </SmallField>
            <div className="grid grid-cols-2 gap-2">
              <SmallField label="Kuota">
                <input
                  value={scheduleFormState.capacity}
                  onChange={(event) =>
                    setScheduleFormState((current) => ({ ...current, capacity: event.target.value }))
                  }
                  className={inputClassName}
                />
              </SmallField>
              <SmallField label="Harga tiket">
                <input
                  value={scheduleFormState.price}
                  onChange={(event) =>
                    setScheduleFormState((current) => ({ ...current, price: event.target.value }))
                  }
                  className={inputClassName}
                />
              </SmallField>
            </div>
            {dialogError && <FormError>{dialogError}</FormError>}
            <ModalActions
              saving={saving}
              onCancel={() => setScheduleDialogOpen(false)}
              label={editingSchedule ? "Simpan perubahan" : "Simpan jadwal"}
            />
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#211610]/55 p-4">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="package-delete-title"
            className="w-full max-w-sm rounded-xl border border-[#E6DCC9] bg-[#FFF9EF] p-5 shadow-[0_8px_30px_rgba(48,31,20,.2)]"
          >
            <h2 id="package-delete-title" className="text-sm font-bold text-[#4A291F]">
              Hapus {deleteTarget.kind === "package" ? "paket" : "jadwal"}?
            </h2>
            <p className="mt-2 text-[10px] text-[#82776D]">
              “{deleteTarget.name}” akan dihapus dari daftar.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="h-7 rounded-md border border-[#E2D9CB] px-3 text-[9px] text-[#77685C] hover:bg-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                disabled={deleting}
                className="h-7 rounded-md bg-[#A83B32] px-3 text-[9px] font-semibold text-white hover:bg-[#8F3028] disabled:opacity-60"
              >
                {deleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function RoutineScheduleView({
  schedules,
  groups,
  loading,
  error,
  onRefresh,
  onCreate,
  onEdit,
  onDelete,
}: {
  schedules: RoutineScheduleRecord[];
  groups: { day: string; items: RoutineScheduleRecord[] }[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onCreate: () => void;
  onEdit: (item: RoutineScheduleRecord) => void;
  onDelete: (item: RoutineScheduleRecord) => void;
}) {
  return (
    <section>
      <header className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#A77D5A]">
            AGENDA MINGGUAN
          </p>
          <h1 className="text-[13px] font-bold text-[#4A342A]">Jadwal Rutin</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            aria-label="Muat ulang jadwal rutin"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E1D6C7] text-[#8A6D57] hover:bg-white disabled:opacity-50"
          >
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex h-7 items-center gap-1 rounded-full bg-[#4A291F] px-3 text-[8px] font-semibold text-white hover:bg-[#633A2D]"
          >
            <Plus size={11} aria-hidden="true" />
            Tambah Jadwal
          </button>
        </div>
      </header>
      {error && (
        <p role="alert" className="mb-3 rounded-md bg-[#FFF0ED] px-3 py-2 text-[9px] text-[#9B3D32]">
          {error}
        </p>
      )}
      {loading ? (
        <p className="py-12 text-center text-[9px] text-[#8D8278]">
          Memuat jadwal rutin...
        </p>
      ) : schedules.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D8C8B3] bg-white/70 px-4 py-10 text-center">
          <CalendarDays size={20} className="mx-auto mb-2 text-[#B78C59]" aria-hidden="true" />
          <p className="text-[10px] font-semibold text-[#5D4639]">
            Belum ada jadwal rutin.
          </p>
          <p className="mt-1 text-[8px] text-[#92877D]">
            Tambahkan kegiatan mingguan untuk mengisi daftar ini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(({ day, items }) => (
            <section key={day}>
              <h2 className="mb-1.5 pl-2 text-[9px] font-bold text-[#705446]">
                {day}:
              </h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border border-[#DCD2C5] bg-white p-2 shadow-[0_2px_7px_rgba(54,39,28,.13)] sm:flex-row sm:items-center"
                  >
                    <div
                      className="flex h-20 w-full shrink-0 items-center justify-center rounded-lg border border-[#E7DED2] bg-[#F4E9D9] bg-cover bg-center text-[#A77C50] sm:w-24"
                      style={safeImageStyle(item.imageUrl)}
                    >
                      {!item.imageUrl && <CalendarDays size={20} aria-hidden="true" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex rounded-full bg-[#F4E7D1] px-2 py-1 text-[6px] text-[#997346]">
                        Setiap {day}
                      </span>
                      <h3 className="mt-1 text-[9px] font-bold text-[#44342A]">
                        {item.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-[7px] leading-relaxed text-[#8C8076]">
                        {item.description || "Belum ada deskripsi kegiatan."}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#E6DDD0] bg-[#FFFCF7] px-3 py-2 text-[7px] text-[#806F62] sm:min-w-[95px] sm:flex-col sm:items-start">
                      <span className="font-semibold">{item.capacity || "Kuota —"}</span>
                      <span>{item.price || "Harga —"}</span>
                    </div>
                    <div className="flex shrink-0 gap-1 self-end sm:self-start">
                      <TinyAction label={`Edit ${item.name}`} onClick={() => onEdit(item)} color="green">
                        <Pencil size={9} aria-hidden="true" />
                      </TinyAction>
                      <TinyAction label={`Hapus ${item.name}`} onClick={() => onDelete(item)} color="red">
                        <Trash2 size={9} aria-hidden="true" />
                      </TinyAction>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

function TinyAction({
  label,
  onClick,
  color,
  children,
}: {
  label: string;
  onClick: () => void;
  color: "green" | "red" | "light";
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-5 w-5 items-center justify-center rounded-md ${
        color === "red"
          ? "bg-[#FCE9E5] text-[#D26D56] hover:bg-[#F8DAD3]"
          : color === "green"
            ? "bg-[#E3F4EF] text-[#18A68A] hover:bg-[#D2ECE4]"
            : "bg-white/80 text-[#A58966] hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function Modal({
  eyebrow,
  title,
  onClose,
  children,
}: {
  eyebrow: string;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#211610]/55 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="package-dialog-title"
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-[#E6DCC9] bg-[#FFF9EF] p-4 shadow-[0_8px_30px_rgba(48,31,20,.2)]"
      >
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#BD8660]">
              {eyebrow}
            </p>
            <h2 id="package-dialog-title" className="mt-0.5 text-[14px] font-bold text-[#4A291F]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir"
            className="rounded-full p-1 text-[#806B5C] hover:bg-[#F3E9DA]"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function SmallField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[8px] text-[#75685F]">{label}</span>
      {children}
    </label>
  );
}

function FormError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-md bg-[#FFF0ED] px-3 py-2 text-[9px] text-[#9B3D32]">
      {children}
    </p>
  );
}

function ModalActions({
  saving,
  onCancel,
  label,
  onDelete,
}: {
  saving: boolean;
  onCancel: () => void;
  label: string;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 pt-1">
      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          disabled={saving}
          className="h-7 rounded-md border border-[#E7C4BD] px-3 text-[9px] text-[#A83B32] hover:bg-[#FFF0ED]"
        >
          Hapus Paket
        </button>
      ) : (
        <span />
      )}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="h-7 rounded-md border border-[#E2D9CB] px-3 text-[9px] text-[#77685C] hover:bg-white"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={saving}
          className="h-7 rounded-md bg-[#4A291F] px-4 text-[9px] font-semibold text-white hover:bg-[#633A2D] disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : label}
        </button>
      </div>
    </div>
  );
}

const inputClassName =
  "h-7 w-full rounded-md border border-[#E2D9CB] bg-white px-2 text-[9px] text-[#4A342A] outline-none focus:border-[#C49A4A]";
const textareaClassName =
  "w-full rounded-md border border-[#E2D9CB] bg-white px-2 py-1.5 text-[9px] text-[#4A342A] outline-none focus:border-[#C49A4A]";
