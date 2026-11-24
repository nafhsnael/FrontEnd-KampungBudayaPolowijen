"use client";

import { useEffect, useRef, useState } from "react";
import {
  deletePackageItem,
  fetchPackageItems,
  savePackageItem,
  type PackageRecord,
} from "@/services/admin-content";
import {
  Modal,
  PackageImage,
  TrashIcon,
  inputClass,
  labelClass,
  splitLines,
} from "./adminShared";

type VisitPackage = {
  id: string;
  name: string;
  price: string;
  image: string;
  features: string[];
  extras: string[];
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function packageDetails(description: string): Pick<VisitPackage, "features" | "extras"> {
  try {
    const parsed: unknown = JSON.parse(description);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "features" in parsed &&
      "extras" in parsed &&
      isStringArray(parsed.features) &&
      isStringArray(parsed.extras)
    ) {
      return { features: parsed.features, extras: parsed.extras };
    }
  } catch {
    // Older package records may have plain-text descriptions.
  }
  return {
    features: description.split("\n").map((line) => line.trim()).filter(Boolean),
    extras: [],
  };
}

function toVisitPackage(item: PackageRecord): VisitPackage {
  const details = packageDetails(item.description);
  const price = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(item.price);
  return {
    id: item.id,
    name: item.name,
    price: `Rp ${price}${item.capacity ? ` / ${item.capacity}` : ""}`,
    image: item.imageUrl ?? "",
    ...details,
  };
}

function toNumberPrice(value: string): number {
  const amountText = value.split("/")[0].replace(/^rp\s*/i, "");
  const match = amountText.match(/(\d+(?:[.,]\d+)?)\s*(juta|jt|ribu|rb)?/i);
  if (!match) return 0;
  const amount = match[2]
    ? Number(match[1].replace(",", "."))
    : Number(match[1].replace(/[.,]/g, ""));
  const unit = match[2]?.toLowerCase();
  return amount * (unit === "juta" || unit === "jt" ? 1_000_000 : unit ? 1_000 : 1);
}

function toCapacity(value: string): string {
  const capacity = value.split("/")[1]?.trim() ?? "";
  if (!capacity) return "";
  return /^\d+$/.test(capacity) ? `${capacity} orang` : capacity;
}

const PAYMENT_METHODS = [
  "BCA",
  "Mandiri",
  "BRI",
  "GoPay",
  "OVO",
  "DANA",
  "QRIS",
  "Bayar di lokasi",
];

type ModalState =
  | { type: "order" | "edit" | "delete"; id: string }
  | { type: "create" }
  | null;

/* ---------- Booking modal (Dapatkan Paket) ---------- */

function BookingModal({
  pkg,
  onClose,
}: {
  pkg: VisitPackage;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState("");
  const [payment, setPayment] = useState("");

  const isValid =
    name.trim() && phone.trim() && date && participants.trim() && payment;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // TODO: kirim pesanan ke API
    onClose();
  };

  return (
    <Modal
      onClose={onClose}
      title={
        <span className="block">
          Pemesanan Paket {pkg.name}
          <span className="mt-0.5 block text-xs font-semibold text-[#8a5a2b]">
            {pkg.price}
          </span>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="booking-name" className={labelClass}>
            Nama pemesan
          </label>
          <input
            id="booking-name"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="booking-phone" className={labelClass}>
            No. WhatsApp
          </label>
          <input
            id="booking-phone"
            type="tel"
            inputMode="tel"
            className={inputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="booking-date" className={labelClass}>
              Tanggal kunjungan
            </label>
            <input
              id="booking-date"
              type="date"
              className={inputClass}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="booking-count" className={labelClass}>
              Jumlah peserta
            </label>
            <input
              id="booking-count"
              type="number"
              min={1}
              className={inputClass}
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
            />
          </div>
        </div>

        <fieldset>
          <legend className={labelClass}>Metode pembayaran</legend>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method}
                className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 text-xs text-[#3b2a22] transition ${
                  payment === method
                    ? "border-[#B8933F] bg-[#B8933F]/10"
                    : "border-[#E7D9C4] bg-white hover:border-[#B8933F]/60"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={payment === method}
                  onChange={() => setPayment(method)}
                  className="accent-[#4A2A20]"
                />
                {method}
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={!isValid}
          className="mt-2 w-full rounded-lg bg-[#B8933F] py-2.5 text-sm font-semibold text-white transition hover:bg-[#a38235] disabled:cursor-not-allowed disabled:bg-[#E6CFA0] disabled:text-white/80"
        >
          Konfirmasi pesanan
        </button>
      </form>
    </Modal>
  );
}

/* ---------- Edit / create modal ---------- */

function EditModal({
  pkg,
  onSave,
  onClose,
}: {
  pkg: VisitPackage | null; // null = paket baru
  onSave: (saved: VisitPackage, imageFile: File | null) => Promise<void>;
  onClose: () => void;
}) {
  const isNew = pkg === null;
  const [name, setName] = useState(pkg?.name ?? "");
  const [price, setPrice] = useState(pkg?.price ?? "");
  const [features, setFeatures] = useState(pkg?.features.join("\n") ?? "");
  const [extras, setExtras] = useState(pkg?.extras.join("\n") ?? "");
  const [image, setImage] = useState(pkg?.image ?? "");
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
      await onSave({
        id: pkg?.id ?? `paket-${Date.now()}`,
        name: name.trim(),
        price: price.trim(),
        image,
        features: splitLines(features),
        extras: splitLines(extras),
      }, imageFile);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Gagal menyimpan paket.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={isNew ? "Tambah Paket" : "Edit Paket"} onClose={onClose} showClose>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <p role="alert" className="rounded-md bg-[#FFF0ED] px-3 py-2 text-xs text-[#9B3D32]">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="edit-name" className={labelClass}>
            Nama paket
          </label>
          <input
            id="edit-name"
            required
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="edit-price" className={labelClass}>
            Harga
          </label>
          <input
            id="edit-price"
            required
            placeholder="Rp 1 juta/ 30 orang"
            className={inputClass}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="edit-features" className={labelClass}>
            Isi paket (satu baris satu poin)
          </label>
          <textarea
            id="edit-features"
            rows={5}
            className={inputClass}
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="edit-extras" className={labelClass}>
            Tambahan (satu baris satu poin)
          </label>
          <textarea
            id="edit-extras"
            rows={2}
            className={inputClass}
            value={extras}
            onChange={(e) => setExtras(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="edit-image" className={labelClass}>
            Unggah gambar
          </label>
          <div className="flex items-center gap-2 rounded-md border border-[#E7D9C4] bg-white px-2 py-1.5 text-xs text-[#3b2a22]">
            <input
              id="edit-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFile}
              className="w-full text-xs file:mr-2 file:rounded file:border-0 file:bg-[#EFE3CF] file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-[#4A2A20] hover:file:bg-[#E7D9C4]"
            />
          </div>
          {fileName && (
            <p className="mt-1 text-[11px] text-[#4A2A20]/70">
              {fileName} akan diunggah ke Cloudinary.
            </p>
          )}
        </div>

        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-lg bg-[#d9c7b0]">
          <PackageImage src={image} alt="Pratinjau gambar paket" sizes="360px" />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-[#4A2A20] py-2.5 text-sm font-semibold text-white transition hover:bg-[#6a3d2e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8933F] disabled:cursor-wait disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : isNew ? "Simpan paket" : "Simpan perubahan"}
        </button>
      </form>
    </Modal>
  );
}

/* ---------- Delete confirmation ---------- */

function DeleteModal({
  pkg,
  onConfirm,
  onClose,
}: {
  pkg: VisitPackage;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal title="Hapus paket?" onClose={onClose}>
      <p className="text-sm text-[#3b2a22]">
        Paket <strong>{pkg.name}</strong> akan dihapus dan tidak bisa
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
          Hapus paket
        </button>
      </div>
    </Modal>
  );
}

/* ---------- Carousel ---------- */

const CARD_STEP = 248; // jarak antar kartu (px) saat digeser
const ANIM_MS = 380;

const mod = (n: number, m: number) => ((n % m) + m) % m;
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

// Posisi dan ukuran kartu dihitung dari jaraknya ke tengah (a = |rel|),
// jadi kartu bergerak mulus mengikuti jari dan tidak loncat.
const spreadOf = (a: number) =>
  a <= 1 ? a * CARD_STEP : CARD_STEP + (a - 1) * 168;
const scaleOf = (a: number) =>
  a <= 1 ? 1 - 0.28 * a : Math.max(0.4, 0.72 - 0.27 * (a - 1));

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Paket sebelumnya" : "Paket berikutnya"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4A2A20] text-white transition hover:bg-[#6a3d2e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8933F]"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {direction === "prev" ? (
          <path d="M15 5l-7 7 7 7" />
        ) : (
          <path d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

type CardVariant = "center" | "near" | "far";

function PackageCard({
  pkg,
  variant,
  style,
  hidden,
  onSelect,
  onOrder,
  onEdit,
  onDelete,
}: {
  pkg: VisitPackage;
  variant: CardVariant;
  style: React.CSSProperties;
  hidden: boolean;
  onSelect: () => void;
  onOrder: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isCenter = variant === "center";
  const isFar = variant === "far";

  const listClass = `mt-3 space-y-0.5 text-[11px] ${
    isCenter ? "text-[#E0B85A]" : "text-[#4A2A20]"
  }`;

  return (
    <article
      onClick={isCenter ? undefined : onSelect}
      aria-current={isCenter ? "true" : undefined}
      aria-hidden={hidden || undefined}
      style={style}
      className={`absolute left-1/2 top-1/2 w-[270px] select-none rounded-3xl border-2 border-[#4A2A20] p-5 transition-colors duration-200 will-change-transform ${
        isCenter
          ? "bg-[#4A2A20] text-white shadow-[0_10px_30px_rgba(74,42,32,0.35)]"
          : "cursor-pointer bg-[#FFF8EC] text-[#4A2A20] shadow-[0_4px_14px_rgba(74,42,32,0.2)]"
      }`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#d9c7b0]">
        <PackageImage src={pkg.image} alt={`Foto paket ${pkg.name}`} sizes="270px" />
      </div>

      <div className="mt-4 flex items-start justify-between gap-2">
        <p className="text-xs font-semibold leading-tight">
          Paket
          <br />
          {pkg.name}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label={`Hapus paket ${pkg.name}`}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#E7D9C4] bg-[#FFF8EC] text-[#B5483A] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8933F]"
        >
          <TrashIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      <p
        className={`mt-2 text-base font-semibold ${
          isCenter ? "text-[#E0B85A]" : ""
        }`}
      >
        {pkg.price}
      </p>

      {!isFar && (
        <>
          <ul className={listClass}>
            {pkg.features.map((item) => (
              <li key={item} className="flex gap-1.5">
                <span aria-hidden="true">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {pkg.extras.length > 0 && (
            <ul className={listClass}>
              {pkg.extras.map((item) => (
                <li key={item} className="flex gap-1.5">
                  <span aria-hidden="true">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {isCenter && (
        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={onOrder}
            className="w-full rounded-lg bg-[#B8933F] py-2 text-xs font-semibold text-white transition hover:bg-[#a38235] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Dapatkan Paket
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#FFF8EC] py-2 text-xs font-semibold text-[#4A2A20] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
            Edit Paket
          </button>
        </div>
      )}
    </article>
  );
}

/* ---------- Main section ---------- */

export default function AdminPackageSection() {
  const [packages, setPackages] = useState<VisitPackage[]>([]);
  const [modal, setModal] = useState<ModalState>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // pos = posisi carousel (angka desimal saat digeser/beranimasi)
  const [pos, setPos] = useState(0);
  const [stageWidth, setStageWidth] = useState(1000);

  const posRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const swiped = useRef(false);
  const drag = useRef<{
    active: boolean;
    startX: number;
    startPos: number;
    lastX: number;
    lastT: number;
    velocity: number;
  } | null>(null);

  const total = packages.length;
  const hasStage = total > 0;

  useEffect(() => {
    let active = true;
    fetchPackageItems()
      .then((items) => {
        if (active) setPackages(items.map(toVisitPackage));
      })
      .catch((loadError: unknown) => {
        if (active) {
          setPageError(
            loadError instanceof Error ? loadError.message : "Gagal memuat paket."
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

  // Ukur lebar area carousel supaya jumlah kartu yang tampil menyesuaikan
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    setStageWidth(el.clientWidth);
    const observer = new ResizeObserver(([entry]) =>
      setStageWidth(entry.contentRect.width),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStage]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const cancelAnimation = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const setPosition = (value: number) => {
    posRef.current = value;
    setPos(value);
  };

  const jumpTo = (index: number) => {
    cancelAnimation();
    targetRef.current = index;
    setPosition(index);
  };

  const animateTo = (target: number) => {
    cancelAnimation();
    const from = posRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || from === target) {
      setPosition(target);
      return;
    }
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / ANIM_MS);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setPosition(from + (target - from) * eased);
      rafRef.current = t < 1 ? requestAnimationFrame(tick) : null;
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const go = (step: number) => {
    if (total < 2) return;
    targetRef.current += step;
    animateTo(targetRef.current);
  };

  /* Geser dengan mouse atau jari */
  const handlePointerDown = (e: React.PointerEvent) => {
    if (total < 2) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    swiped.current = false;
    drag.current = {
      active: false,
      startX: e.clientX,
      startPos: posRef.current,
      lastX: e.clientX,
      lastT: e.timeStamp,
      velocity: 0,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;

    if (!d.active) {
      if (Math.abs(e.clientX - d.startX) < 6) return; // abaikan getaran kecil
      d.active = true;
      swiped.current = true;
      cancelAnimation();
      d.startX = e.clientX;
      d.startPos = posRef.current;
      d.lastX = e.clientX;
      d.lastT = e.timeStamp;
      stageRef.current?.setPointerCapture(e.pointerId);
      return;
    }

    setPosition(d.startPos - (e.clientX - d.startX) / CARD_STEP);

    const dt = e.timeStamp - d.lastT;
    if (dt > 0) {
      d.velocity = 0.8 * ((e.clientX - d.lastX) / dt) + 0.2 * d.velocity;
    }
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
  };

  const handlePointerEnd = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.active) return;
    // Lanjutkan sedikit sesuai kecepatan lepas jari, lalu "snap" ke kartu terdekat
    const projected = posRef.current - (d.velocity * 160) / CARD_STEP;
    const base = Math.round(d.startPos);
    const target = clamp(Math.round(projected), base - 2, base + 2);
    targetRef.current = target;
    animateTo(target);
  };

  // Setelah menggeser, abaikan klik yang ikut terpicu
  const handleClickCapture = (e: React.MouseEvent) => {
    if (swiped.current) {
      e.stopPropagation();
      e.preventDefault();
      swiped.current = false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  const selectCard = (rel: number) => {
    targetRef.current = Math.round(posRef.current) + Math.round(rel);
    animateTo(targetRef.current);
  };

  /* Modal & data */
  const modalPackage =
    modal && modal.type !== "create"
      ? packages.find((p) => p.id === modal.id)
      : undefined;

  const closeModal = () => setModal(null);

  const handleSave = async (saved: VisitPackage, imageFile: File | null) => {
    const exists = packages.some((p) => p.id === saved.id);
    setPageError(null);
    const savedRecord = await savePackageItem(
      exists ? saved.id : null,
      {
        name: saved.name,
        description: JSON.stringify({
          features: saved.features,
          extras: saved.extras,
        }),
        duration: "",
        capacity: toCapacity(saved.price),
        price: toNumberPrice(saved.price),
        imageUrl: imageFile ? (packages.find((item) => item.id === saved.id)?.image ?? null) : saved.image || null,
        isActive: true,
      },
      imageFile
    );
    const updatedPackage = toVisitPackage(savedRecord);
    setPackages((list) =>
      exists
        ? list.map((item) => item.id === saved.id ? updatedPackage : item)
        : [...list, updatedPackage]
    );
    if (!exists) jumpTo(total);
    closeModal();
  };

  const handleDelete = async (id: string) => {
    const removedIndex = packages.findIndex((p) => p.id === id);
    const center = mod(Math.round(posRef.current), total);
    const newTotal = total - 1;
    setPageError(null);
    try {
      await deletePackageItem(id);
    } catch (deleteError) {
      setPageError(
        deleteError instanceof Error ? deleteError.message : "Gagal menghapus paket."
      );
      closeModal();
      return;
    }

    setPackages((list) => list.filter((p) => p.id !== id));
    const next = removedIndex < center ? center - 1 : center;
    jumpTo(Math.max(0, Math.min(next, newTotal - 1)));
    closeModal();
  };

  /* Hitung tampilan tiap kartu */
  const widthRange = stageWidth >= 960 ? 2 : stageWidth >= 720 ? 1 : 0;
  const range = Math.min(widthRange, Math.max(0, total - 1));

  return (
    <div>
      <div className="flex justify-end pt-6">
        <button
          type="button"
          onClick={() => setModal({ type: "create" })}
          className="flex items-center gap-2 rounded-xl bg-[#4A2A20] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#6a3d2e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8933F]"
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
          Tambah Paket
        </button>
      </div>

      {pageError && (
        <p role="alert" className="mt-3 rounded-md bg-[#FFF0ED] px-3 py-2 text-sm text-[#9B3D32]">
          {pageError}
        </p>
      )}

      {loading && (
        <p className="py-6 text-center text-sm text-[#4A2A20]/70">
          Memuat paket...
        </p>
      )}

      {total === 0 ? (
        !loading && !pageError ? (
          <div className="py-20 text-center text-sm text-[#4A2A20]/70">
            Belum ada paket kunjungan. Klik &quot;Tambah Paket&quot; untuk
            membuat paket pertama.
          </div>
        ) : null
      ) : (
        <div className="flex items-center gap-3 py-4">
          {total > 1 && <ArrowButton direction="prev" onClick={() => go(-1)} />}

          <div
            ref={stageRef}
            role="group"
            aria-roledescription="carousel"
            aria-label="Daftar paket kunjungan"
            tabIndex={0}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onClickCapture={handleClickCapture}
            onKeyDown={handleKeyDown}
            onDragStart={(e) => e.preventDefault()}
            className="relative h-[600px] min-w-0 flex-1 cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#B8933F]"
          >
            {packages.map((pkg, i) => {
              let rel = mod(i - pos, total);
              if (rel > total / 2) rel -= total;
              const a = Math.abs(rel);

              const opacity = clamp((range + 0.5 - a) / 0.5, 0, 1);
              const x = Math.sign(rel) * spreadOf(a);
              const rounded = Math.round(a);
              const variant: CardVariant =
                rounded === 0 ? "center" : rounded === 1 ? "near" : "far";

              return (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  variant={variant}
                  hidden={opacity === 0}
                  style={{
                    transform: `translate(-50%, -50%) translateX(${x}px) scale(${scaleOf(a)})`,
                    opacity,
                    zIndex: Math.round(100 - a * 10),
                    visibility: opacity === 0 ? "hidden" : "visible",
                    pointerEvents: opacity < 0.4 ? "none" : "auto",
                  }}
                  onSelect={() => selectCard(rel)}
                  onOrder={() => setModal({ type: "order", id: pkg.id })}
                  onEdit={() => setModal({ type: "edit", id: pkg.id })}
                  onDelete={() => setModal({ type: "delete", id: pkg.id })}
                />
              );
            })}
          </div>

          {total > 1 && <ArrowButton direction="next" onClick={() => go(1)} />}
        </div>
      )}

      {modal?.type === "order" && modalPackage && (
        <BookingModal pkg={modalPackage} onClose={closeModal} />
      )}

      {modal?.type === "edit" && modalPackage && (
        <EditModal pkg={modalPackage} onSave={handleSave} onClose={closeModal} />
      )}

      {modal?.type === "create" && (
        <EditModal pkg={null} onSave={handleSave} onClose={closeModal} />
      )}

      {modal?.type === "delete" && modalPackage && (
        <DeleteModal
          pkg={modalPackage}
          onConfirm={() => void handleDelete(modalPackage.id)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}