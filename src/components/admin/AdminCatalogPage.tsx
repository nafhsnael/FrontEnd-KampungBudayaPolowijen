"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Store,
  Trash2,
  X,
} from "lucide-react";
import {
  deleteEventItem,
  deleteUmkmItem,
  EventRecord,
  fetchEventItems,
  fetchUmkmItems,
  saveEventItem,
  saveUmkmItem,
  UmkmRecord,
} from "@/services/admin-content";

type CatalogSection = "umkm" | "events";
type CatalogRecord = UmkmRecord | EventRecord;
type FormKey =
  | "name"
  | "description"
  | "category"
  | "price"
  | "imageUrl"
  | "eventDate"
  | "capacity"
  | "posterUrl"
  | "status";

type FormState = Record<FormKey, string>;
type FieldDefinition = {
  key: FormKey;
  label: string;
  type: "text" | "url" | "number" | "date" | "textarea" | "status" | "file";
  required?: boolean;
};

const SECTION_CONFIG: Record<
  CatalogSection,
  { title: string; fields: FieldDefinition[] }
> = {
  umkm: {
    title: "UMKM",
    fields: [
      { key: "name", label: "Nama UMKM", type: "text", required: true },
      { key: "category", label: "Jenis usaha", type: "text", required: true },
      { key: "description", label: "Deskripsi", type: "textarea" },
      { key: "imageUrl", label: "Upload gambar (opsional)", type: "file" },
    ],
  },
  events: {
    title: "Event",
    fields: [
      { key: "name", label: "Nama event", type: "text", required: true },
      { key: "eventDate", label: "Tanggal kegiatan", type: "date", required: true },
      { key: "description", label: "Tentang kegiatan", type: "textarea" },
      { key: "posterUrl", label: "Unggah poster", type: "file" },
      { key: "capacity", label: "Kuota", type: "text" },
      { key: "price", label: "Harga tiket", type: "text" },
      { key: "status", label: "Status", type: "status", required: true },
    ],
  },
};

function isCatalogSection(value: string): value is CatalogSection {
  return value === "umkm" || value === "events";
}

function fetchCatalogItems(section: CatalogSection): Promise<CatalogRecord[]> {
  return section === "umkm" ? fetchUmkmItems() : fetchEventItems();
}

function makeFormState(section: CatalogSection, item?: CatalogRecord): FormState {
  return {
    name: item?.name ?? "",
    description: item?.description ?? "",
    category: item && "category" in item ? item.category : "",
    price: item && "price" in item ? String(item.price) : "",
    imageUrl: item && "imageUrl" in item ? item.imageUrl ?? "" : "",
    eventDate: item && "eventDate" in item ? item.eventDate : "",
    capacity: item && "capacity" in item ? item.capacity : "",
    posterUrl: item && "posterUrl" in item ? item.posterUrl ?? "" : "",
    status: item && "status" in item ? item.status : "Upcoming",
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

function formatEventDate(value: string): string {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function umkmCategoryClassName(category: string): string {
  switch (category.trim().toLowerCase()) {
        case "kriya":
          return "bg-[#F0E2D3] text-[#A77C50]";
        case "kuliner":
          return "bg-[#FBECDD] text-[#C18B57]";
        case "minuman":
          return "bg-[#E3F0EE] text-[#609A99]";
        default:
          return "bg-[#F5E9D7] text-[#97754F]";
      }
}

export default function AdminCatalogPage({ section }: { section: string }) {
  if (!isCatalogSection(section)) return null;
  return <CatalogManager key={section} section={section} />;
}

function CatalogManager({ section }: { section: CatalogSection }) {
  const config = SECTION_CONFIG[section];
  const [items, setItems] = useState<CatalogRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogRecord | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<CatalogRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<FormState>(() => makeFormState(section));
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchCatalogItems(section));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : `Gagal memuat data ${config.title}.`
      );
    } finally {
      setLoading(false);
    }
  }, [config.title, section]);

  useEffect(() => {
    let active = true;
    fetchCatalogItems(section)
      .then((result) => {
        if (active) setItems(result);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : `Gagal memuat data ${config.title}.`
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [config.title, section]);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
      [
        item.name,
        item.description,
        "category" in item ? item.category : item.eventDate,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [items, search]);

  const umkmItems = visibleItems.filter(
    (item): item is UmkmRecord => "category" in item
  );
  const eventItems = visibleItems.filter(
    (item): item is EventRecord => "eventDate" in item
  );
  const allUmkm = items.filter(
    (item): item is UmkmRecord => "category" in item
  );
  const categories = new Set(allUmkm.map((item) => item.category).filter(Boolean));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = eventItems
    .filter(
      (item) =>
        item.status !== "Completed" &&
        new Date(`${item.eventDate}T00:00:00`) >= today
    )
    .sort((left, right) => left.eventDate.localeCompare(right.eventDate));
  const nearestEvent = upcomingEvents[0];
  const historyEvents = eventItems.filter(
    (item) => item.id !== nearestEvent?.id
  );

  function openCreateDialog() {
    setEditing(undefined);
    setForm(makeFormState(section));
    setImageFile(null);
    setDialogError(null);
    setDialogOpen(true);
  }

  function openEditDialog(item: CatalogRecord) {
    setEditing(item);
    setForm(makeFormState(section, item));
    setImageFile(null);
    setDialogError(null);
    setDialogOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setDialogError(null);
    try {
      const data = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: form.price.trim() || "0",
        imageUrl: form.imageUrl.trim() || null,
        posterUrl: form.posterUrl.trim() || null,
        category: form.category.trim(),
        eventDate: form.eventDate,
        capacity: form.capacity.trim(),
        status: form.status,
      };

      if (section === "umkm") {
        await saveUmkmItem(editing?.id ?? null, {
          ...data,
          price: Number(data.price),
        }, imageFile);
      } else {
        await saveEventItem(editing?.id ?? null, data, imageFile);
      }

      setDialogOpen(false);
      await loadItems();
    } catch (saveError) {
      setDialogError(
        saveError instanceof Error
          ? saveError.message
          : `Gagal menyimpan ${config.title}.`
      );
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      if (section === "umkm") {
        await deleteUmkmItem(deleteTarget.id);
      } else {
        await deleteEventItem(deleteTarget.id);
      }
      setDeleteTarget(null);
      await loadItems();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : `Gagal menghapus ${config.title}.`
      );
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  function updateField(key: FormKey, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="mx-auto max-w-6xl">
      {section === "umkm" ? (
        <UmkmView
          items={umkmItems}
          totalCount={allUmkm.length}
          categoryCount={categories.size}
          search={search}
          loading={loading}
          error={error}
          onSearch={setSearch}
          onCreate={openCreateDialog}
          onEdit={openEditDialog}
          onDelete={setDeleteTarget}
        />
      ) : (
        <EventView
          nearest={nearestEvent}
          history={historyEvents}
          loading={loading}
          error={error}
          onRefresh={() => void loadItems()}
          onCreate={openCreateDialog}
          onEdit={openEditDialog}
          onDelete={setDeleteTarget}
        />
      )}

      {dialogOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#211610]/55 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setDialogOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalog-dialog-title"
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-[#E6DCC9] bg-[#FFF9EF] p-4 shadow-[0_8px_30px_rgba(48,31,20,.2)]"
          >
            <header className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#BD8660]">
                  {section === "umkm" ? "DIREKTORI USAHA" : "AGENDA KEGIATAN"}
                </p>
                <h2
                  id="catalog-dialog-title"
                  className="mt-0.5 text-[14px] font-bold text-[#4A291F]"
                >
                  {editing ? `Edit ${config.title}` : `Tambah ${config.title}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
                aria-label="Tutup formulir"
                className="rounded-full p-1 text-[#806B5C] hover:bg-[#F3E9DA]"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </header>

            {dialogError && (
              <p
                role="alert"
                className="mb-3 rounded-md bg-[#FFF0ED] px-3 py-2 text-[9px] text-[#9B3D32]"
              >
                {dialogError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-2.5">
              {config.fields.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-1 block text-[8px] text-[#75685F]">
                    {field.label}
                  </span>
                  {field.type === "textarea" ? (
                    <textarea
                      value={form[field.key]}
                      onChange={(event) =>
                        updateField(field.key, event.target.value)
                      }
                      rows={3}
                      required={field.required}
                      className="w-full rounded-md border border-[#E2D9CB] bg-white px-2 py-1.5 text-[9px] text-[#4A342A] outline-none focus:border-[#C49A4A]"
                    />
                  ) : field.type === "file" ? (
                    <>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        onChange={(event) => {
                          setImageFile(event.target.files?.[0] ?? null);
                          setDialogError(null);
                        }}
                        className="w-full rounded-md border border-[#E2D9CB] bg-white px-2 py-1.5 text-[9px] text-[#4A342A] file:mr-2 file:rounded file:border-0 file:bg-[#F3E9DA] file:px-2 file:py-1 file:text-[8px] file:text-[#4A342A]"
                      />
                      <span className="mt-1 block text-[8px] text-[#8C8178]">
                        {imageFile
                          ? `${imageFile.name} akan diunggah ke Cloudinary.`
                          : (field.key === "posterUrl" ? form.posterUrl : form.imageUrl)
                            ? "Gambar lama dipertahankan jika tidak memilih file baru."
                            : "Pilih gambar dari perangkat (maksimal 5 MB)."}
                      </span>
                    </>
                  ) : field.type === "status" ? (
                    <select
                      value={form[field.key]}
                      onChange={(event) =>
                        updateField(field.key, event.target.value)
                      }
                      required={field.required}
                      className="h-7 w-full rounded-md border border-[#E2D9CB] bg-white px-2 text-[9px] text-[#4A342A] outline-none focus:border-[#C49A4A]"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={form[field.key]}
                      onChange={(event) =>
                        updateField(field.key, event.target.value)
                      }
                      required={field.required}
                      min={field.type === "number" ? "0" : undefined}
                      step={field.type === "number" ? "1" : undefined}
                      className="h-7 w-full rounded-md border border-[#E2D9CB] bg-white px-2 text-[9px] text-[#4A342A] outline-none focus:border-[#C49A4A]"
                    />
                  )}
                </label>
              ))}

              <button
                type="submit"
                disabled={saving}
                className="mt-1 inline-flex h-8 w-full items-center justify-center rounded-md bg-[#4A291F] text-[9px] font-semibold text-white hover:bg-[#633A2D] disabled:opacity-60"
              >
                {saving
                  ? "Menyimpan..."
                  : editing
                    ? "Simpan perubahan"
                    : `Simpan ${config.title}`}
              </button>
            </form>
          </section>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#211610]/55 p-4">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-sm rounded-xl border border-[#E6DCC9] bg-[#FFF9EF] p-5 shadow-[0_8px_30px_rgba(48,31,20,.2)]"
          >
            <h2 id="delete-title" className="text-sm font-bold text-[#4A291F]">
              Hapus {section === "umkm" ? "UMKM" : "event"}?
            </h2>
            <p className="mt-2 text-[10px] leading-relaxed text-[#82776D]">
              “{deleteTarget.name}” akan dihapus dari daftar. Tindakan ini tidak
              dapat dibatalkan.
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

function UmkmView({
  items,
  totalCount,
  categoryCount,
  search,
  loading,
  error,
  onSearch,
  onCreate,
  onEdit,
  onDelete,
}: {
  items: UmkmRecord[];
  totalCount: number;
  categoryCount: number;
  search: string;
  loading: boolean;
  error: string | null;
  onSearch: (value: string) => void;
  onCreate: () => void;
  onEdit: (item: CatalogRecord) => void;
  onDelete: (item: CatalogRecord) => void;
}) {
  return (
    <>
      <section className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-[#E6DDD0] bg-white px-4 py-6 shadow-[0_2px_8px_rgba(74,41,31,.06)] sm:px-5">
        <div className="min-w-[110px] border-r border-[#E7DED2] pr-5">
          <p className="text-[10px] text-[#8F8175]">UMKM Terdaftar</p>
          <p className="mt-1 text-2xl font-bold leading-none text-[#4A342A]">
            {loading ? "—" : totalCount}
          </p>
        </div>
        <div className="min-w-[100px] border-r border-[#E7DED2] pr-5">
          <p className="text-[10px] text-[#8F8175]">Kategori Usaha</p>
          <p className="mt-1 text-2xl font-bold leading-none text-[#4A342A]">
            {loading ? "—" : categoryCount}
          </p>
        </div>
        <p className="max-w-[250px] flex-1 text-[10px] leading-relaxed text-[#8C8178]">
          Mengangkat kriya, kuliner, dan minuman khas Polowijen.
        </p>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-[#4A291F] px-4 text-[10px] font-semibold text-white shadow-sm hover:bg-[#633A2D]"
        >
          <Plus size={14} aria-hidden="true" />
          Tambah UMKM Baru
        </button>
      </section>

      <section className="rounded-2xl border border-[#EEE8E0] bg-white py-3 shadow-[0_2px_10px_rgba(74,41,31,.06)]">
        <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#B88962]">
              DIREKTORI USAHA
            </p>
            <h1 className="text-[14px] font-bold text-[#4A342A]">Daftar UMKM</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <label className="flex h-7 items-center gap-1.5 rounded-md border border-[#E8E0D6] px-2 text-[#9A8B7D]">
              <Search size={11} aria-hidden="true" />
              <span className="sr-only">Cari UMKM</span>
              <input
                type="search"
                value={search}
                onChange={(event) => onSearch(event.target.value)}
                placeholder="Cari nama atau kategori"
                className="w-40 bg-transparent text-[8px] text-[#4A342A] outline-none placeholder:text-[#AA9E94] sm:w-44"
              />
            </label>
          </div>
        </header>
        {error && (
          <p role="alert" className="mx-4 mb-2 rounded-md bg-[#FFF0ED] px-3 py-2 text-[9px] text-[#9B3D32]">
            {error}
          </p>
        )}
        <div className="mx-3 overflow-hidden rounded-xl border border-[#F0EBE5]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left">
              <thead className="border-b border-[#F0EBE5] bg-[#FCFAF7] text-[8px] text-[#A0958C]">
                <tr>
                  <th className="w-12 px-3 py-2.5 font-medium">No.</th>
                  <th className="px-2 py-2.5 font-medium">Nama UMKM</th>
                  <th className="w-28 px-2 py-2.5 font-medium">Jenis usaha</th>
                  <th className="w-20 px-4 py-2.5 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EEE9]">
                {!loading && items.length === 0 && !error && (
                  <tr>
                    <td colSpan={4} className="px-4 py-9 text-center text-[9px] text-[#92877D]">
                      {totalCount === 0
                        ? "Belum ada data UMKM."
                        : "UMKM yang dicari tidak ditemukan."}
                    </td>
                  </tr>
                )}
                {items.map((item, index) => (
                  <tr key={item.id} className="text-[9px] text-[#786D64] hover:bg-[#FFFCF7]">
                    <td className="px-3 py-3 text-[8px] text-[#A4978B]">
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#F0E7DB] bg-[#F8F1E7] bg-cover bg-center text-[#AD865C]"
                          style={safeImageStyle(item.imageUrl)}
                        >
                          {!item.imageUrl && <Store size={12} aria-hidden="true" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-[#4A342A]">
                            {item.name}
                          </span>
                          <span className="block max-w-[280px] truncate text-[8px] text-[#A0958C]">
                            {item.description || "Tanpa deskripsi"}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5">
                      <span
                        className={`rounded-full px-2 py-1 text-[8px] ${umkmCategoryClassName(item.category)}`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex justify-end gap-1">
                        <IconAction
                          label={`Edit ${item.name}`}
                          onClick={() => onEdit(item)}
                          tone="green"
                        >
                          <Pencil size={10} aria-hidden="true" />
                        </IconAction>
                        <IconAction
                          label={`Hapus ${item.name}`}
                          onClick={() => onDelete(item)}
                          tone="red"
                        >
                          <Trash2 size={10} aria-hidden="true" />
                        </IconAction>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="px-4 py-2 text-[7px] text-[#9A9087]">
          Menampilkan {items.length} dari {totalCount} UMKM
        </p>
      </section>
    </>
  );
}

function EventView({
  nearest,
  history,
  loading,
  error,
  onRefresh,
  onCreate,
  onEdit,
  onDelete,
}: {
  nearest: EventRecord | undefined;
  history: EventRecord[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onCreate: () => void;
  onEdit: (item: CatalogRecord) => void;
  onDelete: (item: CatalogRecord) => void;
}) {
  return (
    <section>
      <header className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[9px] font-semibold text-[#705446]">Event Terdekat:</p>
          <h1 className="text-[16px] font-bold text-[#4A342A]">Event</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            aria-label="Muat ulang event"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E7DED2] text-[#8A6D57] hover:bg-white disabled:opacity-50"
          >
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex h-7 items-center gap-1.5 rounded-md bg-[#4A291F] px-3 text-[8px] font-semibold text-white hover:bg-[#633A2D]"
          >
            <Plus size={11} aria-hidden="true" />
            Tambah Event
          </button>
        </div>
      </header>
      {error && (
        <p role="alert" className="mb-3 rounded-md bg-[#FFF0ED] px-3 py-2 text-[9px] text-[#9B3D32]">
          {error}
        </p>
      )}

      {nearest ? (
        <EventCard item={nearest} featured onEdit={onEdit} onDelete={onDelete} />
      ) : (
        !loading && (
          <div className="rounded-xl border border-[#E6DDD0] bg-white px-4 py-5 text-[9px] text-[#92877D] shadow-sm">
            <CalendarDays size={15} className="mb-1 text-[#B99166]" aria-hidden="true" />
            Belum ada event mendatang.
          </div>
        )
      )}

      <h2 className="mb-2 mt-5 text-[10px] font-semibold text-[#705446]">
        Riwayat Event:
      </h2>
      <div className="space-y-2.5">
        {history.map((item) => (
          <EventCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {!loading && history.length === 0 && !nearest && (
          <p className="rounded-xl border border-dashed border-[#DDD0C0] px-4 py-5 text-center text-[9px] text-[#92877D]">
            Riwayat event akan muncul di sini.
          </p>
        )}
      </div>
    </section>
  );
}

function EventCard({
  item,
  featured = false,
  onEdit,
  onDelete,
}: {
  item: EventRecord;
  featured?: boolean;
  onEdit: (item: CatalogRecord) => void;
  onDelete: (item: CatalogRecord) => void;
}) {
  return (
    <article
      className={`relative rounded-xl border border-[#DED5C8] bg-white p-2.5 shadow-[0_2px_7px_rgba(54,39,28,.15)] ${
        featured ? "mb-2" : ""
      }`}
    >
      <div className="absolute right-2 top-2 z-10 flex gap-1">
        <IconAction label={`Edit ${item.name}`} onClick={() => onEdit(item)} tone="green">
          <Pencil size={9} aria-hidden="true" />
        </IconAction>
        <IconAction label={`Hapus ${item.name}`} onClick={() => onDelete(item)} tone="red">
          <Trash2 size={9} aria-hidden="true" />
        </IconAction>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div
          className={`flex shrink-0 items-center justify-center rounded-lg border border-[#E7DED2] bg-[#F4E9D9] bg-cover bg-center text-[#A77C50] ${
            featured ? "h-28 w-full sm:w-36" : "h-20 w-full sm:w-28"
          }`}
          style={safeImageStyle(item.posterUrl)}
        >
          {!item.posterUrl && <CalendarDays size={22} aria-hidden="true" />}
        </div>
        <div className="min-w-0 flex-1 pr-12">
          <span className="inline-flex rounded-full bg-[#F4E7D1] px-2 py-1 text-[7px] text-[#997346]">
            {formatEventDate(item.eventDate)}
          </span>
          <h3 className="mt-1 text-[11px] font-bold text-[#44342A]">{item.name}</h3>
          <p className="mt-1 line-clamp-2 text-[8px] leading-relaxed text-[#8C8076]">
            {item.description || "Belum ada deskripsi kegiatan."}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[7px] text-[#806F62]">
            <span>{item.capacity || "Kuota belum ditentukan"}</span>
            <span>{item.price || "Harga belum ditentukan"}</span>
            <span>{item.status}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function IconAction({
  label,
  onClick,
  tone,
  children,
}: {
  label: string;
  onClick: () => void;
  tone: "green" | "red";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-5 w-5 items-center justify-center rounded-md ${
        tone === "green"
          ? "bg-[#E3F4EF] text-[#18A68A] hover:bg-[#D2ECE4]"
          : "bg-[#FCE9E5] text-[#D26D56] hover:bg-[#F8DAD3]"
      }`}
    >
      {children}
    </button>
  );
}
