import { getApiErrorMessage } from "@/lib/api-error.mjs";
import { getAuthSession } from "@/lib/auth/session";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type UmkmRecord = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string | null;
};

export type EventRecord = {
  id: string;
  name: string;
  description: string;
  eventDate: string;
  capacity: string;
  price: string;
  posterUrl: string | null;
  status: string;
};

export type PackageRecord = {
  id: string;
  name: string;
  description: string;
  duration: string;
  capacity: string;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
};

export type RoutineScheduleRecord = {
  id: string;
  name: string;
  day: string;
  startTime?: string;
  endTime?: string;
  description: string;
  capacity: string;
  price: string;
  imageUrl: string | null;
};

export type RoutineScheduleFormData = Omit<RoutineScheduleRecord, "id">;

export type CatalogFormData = {
  name: string;
  description: string;
  category?: string;
  eventDate?: string;
  capacity?: string;
  duration?: string;
  price: number | string;
  imageUrl?: string | null;
  posterUrl?: string | null;
  status?: string;
  isActive?: boolean;
};

export type AdminDashboardStats = {
  totalUsers: number;
  totalUmkm: number | null;
  totalEvents: number | null;
  activePackages: number | null;
};

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, fallback = ""): string {
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}

function nullableText(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function numberValue(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function requireRecord(value: unknown, message: string): JsonRecord {
  if (!isRecord(value)) throw new Error(message);
  return value;
}

function requireList(value: unknown, message: string): JsonRecord[] {
  if (!Array.isArray(value) || !value.every(isRecord)) {
    throw new Error(message);
  }
  return value;
}

async function requestData(
  path: string,
  init: RequestInit,
  fallbackMessage: string
): Promise<unknown> {
  const session = getAuthSession();
  if (!session?.accessToken) {
    throw new Error("Sesi admin tidak ditemukan. Silakan login kembali.");
  }

  const headers = new Headers(init.headers);
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;
  if (!isFormData) headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${session.accessToken}`);

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, fallbackMessage));
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error("Respons dari server tidak valid.");
  }

  if (!isRecord(body) || !("data" in body)) {
    throw new Error("Format respons dari server tidak valid.");
  }

  return body.data;
}

function parseUmkm(value: unknown): UmkmRecord {
  const item = requireRecord(value, "Data UMKM dari server tidak valid.");
  return {
    id: text(item.id),
    name: text(item.name),
    category: text(item.category),
    description: text(item.description),
    price: numberValue(item.price),
    imageUrl: nullableText(item.imageUrl),
  };
}

function parseEvent(value: unknown): EventRecord {
  const item = requireRecord(value, "Data event dari server tidak valid.");
  const eventDate = text(item.eventDate);
  return {
    id: text(item.id),
    name: text(item.name),
    description: text(item.description),
    eventDate: eventDate.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? eventDate,
    capacity: text(item.capacity),
    price: text(item.price),
    posterUrl: nullableText(item.posterUrl),
    status: text(item.status, "Upcoming"),
  };
}

function parsePackage(value: unknown): PackageRecord {
  const item = requireRecord(value, "Data paket dari server tidak valid.");
  return {
    id: text(item.id),
    name: text(item.name),
    description: text(item.description),
    duration: text(item.duration),
    capacity: text(item.capacity),
    price: numberValue(item.price),
    imageUrl: nullableText(item.imageUrl),
    isActive: item.isActive === true || item.isActive === 1,
  };
}

function parseRoutineSchedule(value: unknown): RoutineScheduleRecord {
  const item = requireRecord(value, "Data jadwal rutin dari server tidak valid.");
  return {
    id: text(item.id),
    name: text(item.name),
    day: text(item.day),
    startTime: text(item.startTime),
    endTime: text(item.endTime),
    description: text(item.description),
    capacity: text(item.capacity),
    price: text(item.price),
    imageUrl: nullableText(item.imageUrl),
  };
}

export async function fetchUmkmItems(): Promise<UmkmRecord[]> {
  const data = await requestData("/api/umkm", { method: "GET" }, "Gagal memuat data UMKM.");
  return requireList(data, "Format daftar UMKM dari server tidak valid.").map(parseUmkm);
}

export async function saveUmkmItem(
  id: string | null,
  data: CatalogFormData,
  imageFile?: File | null
): Promise<void> {
  const payload = new FormData();
  payload.set("name", data.name);
  payload.set("category", data.category ?? "");
  payload.set("description", data.description);
  payload.set("price", String(Number(data.price)));
  if (imageFile) {
    payload.set("image", imageFile);
  } else if (data.imageUrl) {
    payload.set("imageUrl", data.imageUrl);
  }

  await requestData(
    id ? `/api/umkm/${encodeURIComponent(id)}` : "/api/umkm",
    { method: id ? "PUT" : "POST", body: payload },
    "Gagal menyimpan data UMKM."
  );
}

export async function deleteUmkmItem(id: string): Promise<void> {
  await requestData(
    `/api/umkm/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    "Gagal menghapus data UMKM."
  );
}

export async function fetchEventItems(): Promise<EventRecord[]> {
  const data = await requestData("/api/events", { method: "GET" }, "Gagal memuat data event.");
  return requireList(data, "Format daftar event dari server tidak valid.").map(parseEvent);
}

export async function saveEventItem(
  id: string | null,
  data: CatalogFormData,
  posterFile?: File | null
): Promise<void> {
  const payload = new FormData();
  payload.set("name", data.name);
  payload.set("description", data.description);
  payload.set("eventDate", data.eventDate ?? "");
  payload.set("capacity", data.capacity ?? "");
  payload.set("price", String(data.price ?? ""));
  payload.set("status", data.status ?? "Upcoming");
  if (posterFile) {
    payload.set("poster", posterFile);
  } else if (data.posterUrl) {
    payload.set("posterUrl", data.posterUrl);
  }

  await requestData(
    id ? `/api/events/${encodeURIComponent(id)}` : "/api/events",
    { method: id ? "PUT" : "POST", body: payload },
    "Gagal menyimpan data event."
  );
}

export async function deleteEventItem(id: string): Promise<void> {
  await requestData(
    `/api/events/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    "Gagal menghapus data event."
  );
}

export async function fetchPackageItems(): Promise<PackageRecord[]> {
  const data = await requestData(
    "/api/admin/packages",
    { method: "GET" },
    "Gagal memuat data paket."
  );
  return requireList(data, "Format daftar paket dari server tidak valid.").map(parsePackage);
}

export async function savePackageItem(
  id: string | null,
  data: CatalogFormData,
  imageFile?: File | null
): Promise<PackageRecord> {
  const payload = new FormData();
  payload.set("name", data.name);
  payload.set("description", data.description);
  payload.set("duration", data.duration || "");
  payload.set("capacity", data.capacity || "");
  payload.set("price", String(Number(data.price)));
  payload.set("isActive", String(data.isActive ?? true));
  if (imageFile) {
    payload.set("image", imageFile);
  } else if (data.imageUrl) {
    payload.set("imageUrl", data.imageUrl);
  }

  const saved = await requestData(
    id ? `/api/admin/packages/${encodeURIComponent(id)}` : "/api/admin/packages",
    { method: id ? "PUT" : "POST", body: payload },
    "Gagal menyimpan data paket."
  );
  return parsePackage(saved);
}

export async function deletePackageItem(id: string): Promise<void> {
  await requestData(
    `/api/admin/packages/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    "Gagal menghapus data paket."
  );
}

export async function fetchRoutineSchedules(): Promise<RoutineScheduleRecord[]> {
  const data = await requestData(
    "/api/admin/routine-schedules",
    { method: "GET" },
    "Gagal memuat jadwal rutin."
  );
  return requireList(data, "Format daftar jadwal rutin tidak valid.").map(
    parseRoutineSchedule
  );
}

export async function saveRoutineSchedule(
  id: string | null,
  data: RoutineScheduleFormData,
  imageFile?: File | null
): Promise<RoutineScheduleRecord> {
  const payload = new FormData();
  payload.set("name", data.name);
  payload.set("day", data.day);
  payload.set("description", data.description);
  payload.set("capacity", data.capacity);
  payload.set("price", data.price);
  if (data.startTime) payload.set("startTime", data.startTime);
  if (data.endTime) payload.set("endTime", data.endTime);
  if (imageFile) {
    payload.set("image", imageFile);
  } else if (data.imageUrl) {
    payload.set("imageUrl", data.imageUrl);
  }

  const saved = await requestData(
    id
      ? `/api/admin/routine-schedules/${encodeURIComponent(id)}`
      : "/api/admin/routine-schedules",
    { method: id ? "PUT" : "POST", body: payload },
    "Gagal menyimpan jadwal rutin."
  );
  return parseRoutineSchedule(saved);
}

export async function deleteRoutineSchedule(id: string): Promise<void> {
  await requestData(
    `/api/admin/routine-schedules/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    "Gagal menghapus jadwal rutin."
  );
}

export async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
  const data = await requestData(
    "/api/admin/dashboard/stats",
    { method: "GET" },
    "Gagal memuat statistik dashboard."
  );
  const stats = requireRecord(data, "Format statistik dashboard tidak valid.");
  return {
    totalUsers: numberValue(stats.totalUsers),
    totalUmkm: stats.totalUmkm === null ? null : numberValue(stats.totalUmkm),
    totalEvents: stats.totalEvents === null ? null : numberValue(stats.totalEvents),
    activePackages:
      stats.activePackages === null ? null : numberValue(stats.activePackages),
  };
}
