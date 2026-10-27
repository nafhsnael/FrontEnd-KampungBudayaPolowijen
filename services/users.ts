import { getAuthSession } from "@/lib/auth/session";

export type UserStatus = "Aktif" | "Suspended";
export type UserAccess = "admin" | "user";

export type UserRecord = {
  id: number | string;
  role: string;
  email: string;
  username: string;
  access: UserAccess;
  status: UserStatus;
  fullName?: string;
  roleTitle?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function getAuthHeader(): Record<string, string> {
  const session = getAuthSession();
  return session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {};
}

export async function fetchUsersFromApi(filters?: {
  search?: string;
  status?: string;
  role?: string;
  page?: number;
  limit?: number;
}): Promise<UserRecord[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.status && filters.status !== "Semua") params.append("status", filters.status);
  if (filters?.role && filters.role !== "Semua") params.append("role", filters.role);
  params.append("page", String(filters?.page ?? 1));
  params.append("limit", String(filters?.limit ?? 100));

  const url = `${API_BASE}/api/admin/users?${params.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    let msg = `Gagal mengambil data user (status: ${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.message) msg = errJson.message;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  const json = await response.json();
  const rawUsers = json?.data?.users || json?.data || [];

  return rawUsers.map((item: Record<string, unknown>, index: number) => ({
    id: typeof item.id === "number" || typeof item.id === "string" ? item.id : index + 1,
    role: typeof item.role === "string" ? item.role : (typeof item.roleTitle === "string" ? item.roleTitle : "User"),
    roleTitle: typeof item.roleTitle === "string" ? item.roleTitle : undefined,
    fullName: typeof item.fullName === "string" ? item.fullName : undefined,
    email: typeof item.email === "string" ? item.email : "",
    username: typeof item.username === "string" ? item.username : "",
    access: (item.access === "admin" || item.role === "admin" ? "admin" : "user") as UserAccess,
    status: (item.status === "Suspended" ? "Suspended" : "Aktif") as UserStatus,
  }));
}

export async function updateUserApi(
  id: number | string,
  data: Partial<UserRecord>
): Promise<UserRecord> {
  const url = `${API_BASE}/api/admin/users/${id}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({
      role: data.role,
      roleTitle: data.role,
      username: data.username,
      email: data.email,
      status: data.status,
      access: data.access,
    }),
  });

  if (!response.ok) {
    let msg = "Gagal memperbarui data user";
    try {
      const errJson = await response.json();
      if (errJson && errJson.message) msg = errJson.message;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  const json = await response.json();
  const item = json?.data ?? {};
  return {
    id: item.id ?? id,
    role: item.role || item.roleTitle || data.role || "User",
    roleTitle: item.roleTitle || data.role,
    fullName: item.fullName,
    email: item.email || data.email || "",
    username: item.username || data.username || "",
    access: (item.access || data.access || "user") as UserAccess,
    status: (item.status || data.status || "Aktif") as UserStatus,
  };
}

export async function toggleUserStatusApi(
  id: number | string,
  newStatus: UserStatus
): Promise<void> {
  await updateUserApi(id, { status: newStatus });
}
