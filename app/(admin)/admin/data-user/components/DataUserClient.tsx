"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminUsersHeader from "@/app/components/admin/AdminUsersHeader";
import AdminUsersList from "@/app/components/admin/AdminUsersList";

import {
  fetchUsersFromApi,
  updateUserApi,
  toggleUserStatusApi,
  type UserRecord,
  type UserStatus,
} from "@/services/users";

type UserCache = {
  expiresAt: number;
  users: UserRecord[];
};

const USER_CACHE_KEY = "kampung-polowijen-admin-users";
const USER_CACHE_TTL = 5 * 60 * 1000;

const INITIAL_USERS: UserRecord[] = [
  { id: 1, role: "Super Admin", email: "admin@kambudpolo.com", username: "admin_utama", access: "admin", status: "Aktif" },
  { id: 2, role: "Manajer UMKM", email: "umkm@kambudpolo.com", username: "manajer_umkm", access: "user", status: "Aktif" },
  { id: 3, role: "Admin Event", email: "event@kambudpolo.com", username: "event_admin", access: "admin", status: "Aktif" },
  { id: 4, role: "Pengelola Paket", email: "paket@kambudpolo.com", username: "paket_admin", access: "user", status: "Suspended" },
  { id: 5, role: "User", email: "pembaca@kambudpolo.com", username: "pembaca1", access: "user", status: "Aktif" },
  { id: 6, role: "Manajer UMKM", email: "budi@kambudpolo.com", username: "budi_santoso", access: "user", status: "Aktif" },
  { id: 7, role: "Admin Event", email: "sari@kambudpolo.com", username: "sari_widiyanti", access: "admin", status: "Aktif" },
  { id: 8, role: "User", email: "dimas@kambudpolo.com", username: "dimas_putri", access: "user", status: "Suspended" },
  { id: 9, role: "Manajer UMKM", email: "arif@kambudpolo.com", username: "arif_pratama", access: "user", status: "Aktif" },
  { id: 10, role: "Pengelola Paket", email: "maya@kambudpolo.com", username: "maya_lestari", access: "user", status: "Aktif" },
  { id: 11, role: "Super Admin", email: "putri@kambudpolo.com", username: "putri_admin", access: "admin", status: "Aktif" },
  { id: 12, role: "User", email: "rudi@kambudpolo.com", username: "rudi_wahidin", access: "user", status: "Aktif" },
  { id: 13, role: "Admin Event", email: "nisa@kambudpolo.com", username: "nisa_azizah", access: "admin", status: "Aktif" },
  { id: 14, role: "Manajer UMKM", email: "fajar@kambudpolo.com", username: "fajar_ramadhan", access: "user", status: "Suspended" },
  { id: 15, role: "Pengelola Paket", email: "indah@kambudpolo.com", username: "indah_sari", access: "user", status: "Aktif" },
  { id: 16, role: "User", email: "dian@kambudpolo.com", username: "dian_mayanti", access: "user", status: "Aktif" },
  { id: 17, role: "Admin Event", email: "rio@kambudpolo.com", username: "rio_pratama", access: "admin", status: "Aktif" },
  { id: 18, role: "Manajer UMKM", email: "tari@kambudpolo.com", username: "tari_puspita", access: "user", status: "Aktif" },
];

let memoryCache: UserCache | null = null;

function isUserRecord(value: unknown): value is UserRecord {
  if (!value || typeof value !== "object") return false;
  const user = value as Partial<UserRecord>;

  return (
    (typeof user.id === "number" || typeof user.id === "string") &&
    typeof user.role === "string" &&
    typeof user.email === "string" &&
    typeof user.username === "string" &&
    (user.access === "admin" || user.access === "user") &&
    (user.status === "Aktif" || user.status === "Suspended")
  );
}

function isUserCache(value: unknown): value is UserCache {
  if (!value || typeof value !== "object") return false;
  const cache = value as Partial<UserCache>;

  return (
    typeof cache.expiresAt === "number" &&
    Array.isArray(cache.users) &&
    cache.users.every(isUserRecord)
  );
}

async function fetchUserData(): Promise<{ users: UserRecord[]; warning: string | null }> {
  try {
    const apiUsers = await fetchUsersFromApi();
    if (apiUsers && apiUsers.length > 0) {
      cacheUserData(apiUsers);
      return { users: apiUsers, warning: null };
    }
  } catch (apiErr) {
    console.warn("Backend API tidak dapat dijangkau, menggunakan data cache / lokal:", apiErr);
  }

  if (memoryCache && memoryCache.expiresAt > Date.now()) {
    return {
      users: memoryCache.users.map((user) => ({ ...user })),
      warning: null,
    };
  }

  let warning: string | null = null;

  if (typeof window !== "undefined") {
    try {
      const cachedValue = window.localStorage.getItem(USER_CACHE_KEY);
      if (cachedValue) {
        const parsedValue: unknown = JSON.parse(cachedValue);
        if (!isUserCache(parsedValue)) {
          warning = "Cache user lokal tidak valid. Data default ditampilkan.";
        } else if (parsedValue.expiresAt > Date.now()) {
          memoryCache = parsedValue;
          return {
            users: parsedValue.users.map((user) => ({ ...user })),
            warning: null,
          };
        }
      }
    } catch {
      warning = "Cache lokal tidak dapat dibaca. Data default ditampilkan.";
    }
  }

  const users = INITIAL_USERS.map((user) => ({ ...user }));
  memoryCache = { users, expiresAt: Date.now() + USER_CACHE_TTL };

  return { users: users.map((user) => ({ ...user })), warning };
}

function cacheUserData(users: UserRecord[]): string | null {
  const cache: UserCache = {
    users: users.map((user) => ({ ...user })),
    expiresAt: Date.now() + USER_CACHE_TTL,
  };
  memoryCache = cache;

  if (typeof window === "undefined") return null;

  try {
    window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cache));
    return null;
  } catch {
    return "Perubahan tersimpan sementara, tetapi cache lokal gagal diperbarui.";
  }
}

function useUserData() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchUserData()
      .then(({ users: fetchedUsers }) => {
        if (!isMounted) return;
        setUsers(fetchedUsers);
      })
      .catch((fetchError: unknown) => {
        if (!isMounted) return;
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Data user gagal dimuat.",
        );
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateUser = useCallback(
    (updatedUser: UserRecord) => {
      const nextUsers = users.map((user) =>
        String(user.id) === String(updatedUser.id) ? { ...updatedUser } : user,
      );
      setUsers(nextUsers);
      cacheUserData(nextUsers);

      updateUserApi(updatedUser.id, updatedUser).catch((err) => {
        console.warn("Sinkronisasi update ke backend gagal:", err);
      });
    },
    [users],
  );

  const toggleStatus = useCallback(
    (userId: number | string) => {
      const user = users.find((currentUser) => String(currentUser.id) === String(userId));
      if (!user) return;

      const nextStatus: UserStatus = user.status === "Aktif" ? "Suspended" : "Aktif";
      const updatedUser: UserRecord = {
        ...user,
        status: nextStatus,
      };

      updateUser(updatedUser);
      toggleUserStatusApi(userId, nextStatus).catch((err) => {
        console.warn("Sinkronisasi toggle status ke backend gagal:", err);
      });
    },
    [updateUser, users],
  );

  return { users, isLoading, error, updateUser, toggleStatus };
}

export default function AdminDataUserPage() {
  const { users, isLoading, error, updateUser, toggleStatus } = useUserData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | UserStatus>("Semua");
  const [draft, setDraft] = useState<UserRecord | null>(null);

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !keyword ||
        `${user.role} ${user.email} ${user.username} ${user.access}`
          .toLowerCase()
          .includes(keyword);
      const matchesStatus = statusFilter === "Semua" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, users]);

  const openEdit = useCallback((user: UserRecord) => {
    setDraft({ ...user });
  }, []);

  const closeEdit = useCallback(() => {
    setDraft(null);
  }, []);

  const saveUser = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!draft) return;
      updateUser(draft);
      closeEdit();
    },
    [closeEdit, draft, updateUser],
  );

  return (
    <>
      <div className="flex min-h-screen bg-[#F5F4F0] font-sans text-[#342D27]">
        <AdminSidebar activeRoute="data-user" />

        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:gap-8">
            <section className="overflow-hidden rounded-2xl border border-[#EAE0CE] bg-[#FAF3E0] shadow-sm">
              <AdminUsersHeader
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                visibleCount={filteredUsers.length}
                totalCount={users.length}
                isLoading={isLoading}
                onSearchChange={setSearchTerm}
                onStatusFilterChange={setStatusFilter}
              />

              <AdminUsersList
                users={filteredUsers}
                isLoading={isLoading}
                error={error}
                emptyMessage="Tidak ada user yang cocok dengan pencarian atau filter."
                onEdit={openEdit}
                onToggleStatus={toggleStatus}
              />
            </section>
          </div>
        </main>
      </div>

      {draft && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#25211D]/50 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && closeEdit()}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
            className="w-full max-w-xl rounded-3xl border border-[#E5DAC8] bg-[#FAF6EE] p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9B3D32]">Data pengguna</p>
                <h2 id="edit-user-title" className="text-xl font-bold text-[#3D2018]">Edit User</h2>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                aria-label="Tutup modal"
                className="rounded-full border border-[#D8CDBC] bg-[#F5EDE0]/60 px-3 py-1.5 text-sm text-[#3D2018] transition hover:bg-[#F5EDE0]"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={saveUser} className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#75685F]">
                Role
                <input
                  required
                  value={draft.role}
                  onChange={(event) => setDraft({ ...draft, role: event.target.value })}
                  className="rounded-xl border border-[#D8CDBC] bg-[#FFFDF7] px-3.5 py-2.5 text-xs font-normal text-[#3D2018] outline-none transition focus:border-[#C49A4A] focus:ring-2 focus:ring-[#C49A4A]/20"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#75685F]">
                Username
                <input
                  required
                  value={draft.username}
                  onChange={(event) => setDraft({ ...draft, username: event.target.value })}
                  className="rounded-xl border border-[#D8CDBC] bg-[#FFFDF7] px-3.5 py-2.5 text-xs font-normal text-[#3D2018] outline-none transition focus:border-[#C49A4A] focus:ring-2 focus:ring-[#C49A4A]/20"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#75685F] sm:col-span-2">
                Email
                <input
                  required
                  type="email"
                  value={draft.email}
                  onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                  className="rounded-xl border border-[#D8CDBC] bg-[#FFFDF7] px-3.5 py-2.5 text-xs font-normal text-[#3D2018] outline-none transition focus:border-[#C49A4A] focus:ring-2 focus:ring-[#C49A4A]/20"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#75685F]">
                Akses
                <select
                  value={draft.access}
                  disabled
                  className="rounded-xl border border-[#E0DBD5] bg-[#EFE8DC] px-3.5 py-2.5 text-xs font-normal text-[#9A9188] outline-none cursor-not-allowed"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#75685F]">
                Status
                <select
                  value={draft.status}
                  onChange={(event) => {
                    const status = event.target.value;
                    if (status === "Aktif" || status === "Suspended") {
                      setDraft({ ...draft, status });
                    }
                  }}
                  className="rounded-xl border border-[#D8CDBC] bg-[#FFFDF7] px-3.5 py-2.5 text-xs font-normal text-[#3D2018] outline-none transition focus:border-[#C49A4A] focus:ring-2 focus:ring-[#C49A4A]/20"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </label>
              <div className="mt-2 flex justify-end gap-2.5 sm:col-span-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-full border border-[#D8CDBC] px-5 py-2.5 text-xs font-semibold text-[#6D5D53] transition hover:bg-[#F5EDE0]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#3D2018] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#2A1610]"
                >
                  Simpan
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
