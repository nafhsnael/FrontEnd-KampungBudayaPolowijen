import Head from "next/head";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Filter, Pencil, Search, ShieldCheck, UserRound, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

type UserStatus = "Aktif" | "Suspended";
type UserAccess = "admin" | "operator" | "viewer";

type UserRecord = {
  id: number;
  role: string;
  email: string;
  username: string;
  access: UserAccess;
  status: UserStatus;
};

type UserCache = {
  expiresAt: number;
  users: UserRecord[];
};

const USER_CACHE_KEY = "kampung-polowijen-admin-users";
const USER_CACHE_TTL = 5 * 60 * 1000;

const INITIAL_USERS: UserRecord[] = [
  { id: 1, role: "Super Admin", email: "admin@kambudpolo.com", username: "admin_utama", access: "admin", status: "Aktif" },
  { id: 2, role: "Manajer UMKM", email: "umkm@kambudpolo.com", username: "manajer_umkm", access: "operator", status: "Aktif" },
  { id: 3, role: "Admin Event", email: "event@kambudpolo.com", username: "event_admin", access: "admin", status: "Aktif" },
  { id: 4, role: "Pengelola Paket", email: "paket@kambudpolo.com", username: "paket_admin", access: "operator", status: "Suspended" },
  { id: 5, role: "User", email: "pembaca@kambudpolo.com", username: "pembaca1", access: "viewer", status: "Aktif" },
  { id: 6, role: "Manajer UMKM", email: "budi@kambudpolo.com", username: "budi_santoso", access: "operator", status: "Aktif" },
  { id: 7, role: "Admin Event", email: "sari@kambudpolo.com", username: "sari_widiyanti", access: "admin", status: "Aktif" },
  { id: 8, role: "User", email: "dimas@kambudpolo.com", username: "dimas_putri", access: "viewer", status: "Suspended" },
  { id: 9, role: "Manajer UMKM", email: "arif@kambudpolo.com", username: "arif_pratama", access: "operator", status: "Aktif" },
  { id: 10, role: "Pengelola Paket", email: "maya@kambudpolo.com", username: "maya_lestari", access: "operator", status: "Aktif" },
  { id: 11, role: "Super Admin", email: "putri@kambudpolo.com", username: "putri_admin", access: "admin", status: "Aktif" },
  { id: 12, role: "User", email: "rudi@kambudpolo.com", username: "rudi_wahidin", access: "viewer", status: "Aktif" },
  { id: 13, role: "Admin Event", email: "nisa@kambudpolo.com", username: "nisa_azizah", access: "admin", status: "Aktif" },
  { id: 14, role: "Manajer UMKM", email: "fajar@kambudpolo.com", username: "fajar_ramadhan", access: "operator", status: "Suspended" },
  { id: 15, role: "Pengelola Paket", email: "indah@kambudpolo.com", username: "indah_sari", access: "operator", status: "Aktif" },
  { id: 16, role: "User", email: "dian@kambudpolo.com", username: "dian_mayanti", access: "viewer", status: "Aktif" },
  { id: 17, role: "Admin Event", email: "rio@kambudpolo.com", username: "rio_pratama", access: "admin", status: "Aktif" },
  { id: 18, role: "Manajer UMKM", email: "tari@kambudpolo.com", username: "tari_puspita", access: "operator", status: "Aktif" },
];

let memoryCache: UserCache | null = null;

function isUserRecord(value: unknown): value is UserRecord {
  if (!value || typeof value !== "object") return false;
  const user = value as Partial<UserRecord>;

  return (
    typeof user.id === "number" &&
    typeof user.role === "string" &&
    typeof user.email === "string" &&
    typeof user.username === "string" &&
    (user.access === "admin" || user.access === "operator" || user.access === "viewer") &&
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
          warning = "Cache user tidak valid. Data awal ditampilkan.";
        } else if (parsedValue.expiresAt > Date.now()) {
          memoryCache = parsedValue;
          return {
            users: parsedValue.users.map((user) => ({ ...user })),
            warning: null,
          };
        }
      }
    } catch {
      warning = "Cache lokal tidak dapat dibaca. Data awal ditampilkan.";
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
  const [cacheWarning, setCacheWarning] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchUserData()
      .then(({ users: fetchedUsers, warning }) => {
        if (!isMounted) return;
        setUsers(fetchedUsers);
        setCacheWarning(warning);
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
        user.id === updatedUser.id ? { ...updatedUser } : user,
      );
      setUsers(nextUsers);
      setCacheWarning(cacheUserData(nextUsers));
    },
    [users],
  );

  const toggleStatus = useCallback(
    (userId: number) => {
      const user = users.find((currentUser) => currentUser.id === userId);
      if (!user) return;

      updateUser({
        ...user,
        status: user.status === "Aktif" ? "Suspended" : "Aktif",
      });
    },
    [updateUser, users],
  );

  return { users, isLoading, error, cacheWarning, updateUser, toggleStatus };
}

export default function AdminDataUserPage() {
  const { users, isLoading, error, cacheWarning, updateUser, toggleStatus } = useUserData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | UserStatus>("Semua");
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
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
    setEditingUser(user);
    setDraft({ ...user });
  }, []);

  const closeEdit = useCallback(() => {
    setEditingUser(null);
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
      <Head>
        <title>Data User | Kampung Budaya Polowijen</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="flex min-h-screen bg-[#FAF3E0] font-sans text-[#3D2018]">
        <AdminSidebar activeRoute="users" />

        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <section className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[#E8DDD1] bg-[#FDF8F2] shadow-md">
            <header className="border-b border-[#E8DDD1] px-5 py-5 sm:px-7 sm:py-6">
              <div className="mb-2 flex items-center gap-2 text-[#9B3D32]">
                <ShieldCheck size={18} aria-hidden="true" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                  Manajemen pengguna
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-wide text-[#3D2018]">Data User</h1>
              <p className="mt-1 text-sm text-[#75685F]">
                Kelola identitas, hak akses, dan status pengguna.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex min-w-0 items-center gap-2.5 rounded-full border border-[#D1C7BD] bg-white px-4 py-2.5 text-[#8A7B70] shadow-sm focus-within:border-[#C49A4A] sm:max-w-sm sm:flex-1">
                  <Search size={16} aria-hidden="true" />
                  <span className="sr-only">Cari user</span>
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Cari nama, email, username..."
                    className="min-w-0 flex-1 bg-transparent text-xs text-[#3D2018] outline-none placeholder:text-[#A89A8D]"
                  />
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <Filter size={15} className="text-[#8A7B70]" aria-hidden="true" />
                  {(["Semua", "Aktif", "Suspended"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      aria-pressed={statusFilter === status}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
                        statusFilter === status
                          ? "bg-[#C59B4E] text-white"
                          : "bg-white text-[#6F6259] hover:bg-[#F0E8DE]"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            <div className="flex items-center justify-between px-5 py-3 sm:px-7">
              <p className="text-xs text-[#75685F]">
                {isLoading ? "Memuat data user..." : `${filteredUsers.length} user ditampilkan`}
              </p>
              <p className="text-xs text-[#8A7B70]">{users.length} total user</p>
            </div>

            {cacheWarning && (
              <p className="mx-5 mb-3 rounded-xl bg-amber-50 px-4 py-2.5 text-xs text-amber-800 sm:mx-7" role="status">
                {cacheWarning}
              </p>
            )}
            {error && (
              <p className="mx-5 mb-3 rounded-xl bg-rose-50 px-4 py-2.5 text-xs text-rose-700 sm:mx-7" role="alert">
                {error}
              </p>
            )}

            <div className="space-y-2.5 px-4 pb-5 sm:px-7 sm:pb-7">
              {!isLoading && !error && filteredUsers.map((user) => (
                <article
                  key={user.id}
                  className="grid gap-4 rounded-2xl border border-[#E8DDD1] bg-[#FDF8F2] p-4 transition-shadow hover:shadow-sm lg:grid-cols-[minmax(70px,0.45fr)_minmax(150px,1.2fr)_minmax(190px,1.5fr)_minmax(130px,1fr)_minmax(105px,0.75fr)_minmax(110px,0.8fr)_minmax(175px,1fr)] lg:items-center"
                >
                  <div className="flex items-center gap-3 lg:block">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E8DDD1] bg-[#F4EADD] text-xs font-semibold text-[#765A42]">
                      {String(user.id).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wide text-[#8A7B70] lg:hidden">
                      ID
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#3D2018]">{user.role}</p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#9B3D32]">
                      {user.access}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[#9A8B7D] lg:hidden">
                      Email
                    </p>
                    <p className="truncate text-xs text-[#5E5149]" title={user.email}>{user.email}</p>
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[#9A8B7D] lg:hidden">
                      Username
                    </p>
                    <p className="flex min-w-0 items-center gap-1.5 text-xs text-[#6E6158]">
                      <UserRound size={13} className="shrink-0 text-[#A88B7A]" aria-hidden="true" />
                      <span className="truncate">{user.username}</span>
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[#9A8B7D] lg:hidden">
                      Role tag
                    </p>
                    <span className="inline-flex rounded-full bg-[#F0E8DE] px-2.5 py-1 text-[10px] font-medium capitalize text-[#755C49]">
                      {user.access}
                    </span>
                  </div>

                  <div>
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[#9A8B7D] lg:hidden">
                      Status
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        user.status === "Aktif"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${user.status === "Aktif" ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {user.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-start gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => openEdit(user)}
                      aria-label={`Edit data ${user.username}`}
                      className="inline-flex items-center gap-1 rounded-full bg-[#00B493] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#00977F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007B67]"
                    >
                      <Pencil size={11} aria-hidden="true" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(user.id)}
                      aria-pressed={user.status === "Suspended"}
                      aria-label={user.status === "Aktif" ? `Suspend ${user.username}` : `Aktifkan ${user.username}`}
                      className={`rounded-full px-3 py-1.5 text-[10px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B3D32] ${
                        user.status === "Aktif"
                          ? "bg-[#FF4D4D] text-white hover:bg-[#E83F3F]"
                          : "bg-[#E9F7F3] text-[#007B67] hover:bg-[#D9F1EB]"
                      }`}
                    >
                      {user.status === "Aktif" ? "Suspe" : "Aktifkan"}
                    </button>
                  </div>
                </article>
              ))}

              {!isLoading && !error && filteredUsers.length === 0 && (
                <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D1C7BD] px-5 py-10 text-center">
                  <UserRound size={28} className="mb-3 text-[#C8B9AA]" aria-hidden="true" />
                  <p className="text-sm font-medium text-[#3D2018]">Pengguna tidak ditemukan</p>
                  <p className="mt-1 text-xs text-[#8A7B70]">Coba kata kunci atau filter status lain.</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {editingUser && draft && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D1B14]/60 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && closeEdit()}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
            className="w-full max-w-xl rounded-3xl border border-[#D1C7BD] bg-[#FDF8F2] p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9B3D32]">Data pengguna</p>
                <h2 id="edit-user-title" className="text-xl font-bold text-[#3D2018]">Edit User</h2>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                className="rounded-full border border-[#D1C7BD] p-2 text-[#3D2018] transition hover:bg-white"
                aria-label="Tutup modal"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={saveUser} className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-medium text-[#5E5149]">
                Nama / Role
                <input
                  required
                  value={draft.role}
                  onChange={(event) => setDraft({ ...draft, role: event.target.value })}
                  className="rounded-xl border border-[#D1C7BD] bg-white px-3 py-2.5 text-sm text-[#3D2018] outline-none focus:border-[#C49A4A] focus:ring-2 focus:ring-[#C49A4A]/20"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium text-[#5E5149]">
                Username
                <input
                  required
                  value={draft.username}
                  onChange={(event) => setDraft({ ...draft, username: event.target.value })}
                  className="rounded-xl border border-[#D1C7BD] bg-white px-3 py-2.5 text-sm text-[#3D2018] outline-none focus:border-[#C49A4A] focus:ring-2 focus:ring-[#C49A4A]/20"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium text-[#5E5149] sm:col-span-2">
                Email
                <input
                  required
                  type="email"
                  value={draft.email}
                  onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                  className="rounded-xl border border-[#D1C7BD] bg-white px-3 py-2.5 text-sm text-[#3D2018] outline-none focus:border-[#C49A4A] focus:ring-2 focus:ring-[#C49A4A]/20"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium text-[#5E5149]">
                Akses
                <select
                  value={draft.access}
                  onChange={(event) => {
                    const access = event.target.value;
                    if (access === "admin" || access === "operator" || access === "viewer") {
                      setDraft({ ...draft, access });
                    }
                  }}
                  className="rounded-xl border border-[#D1C7BD] bg-white px-3 py-2.5 text-sm text-[#3D2018] outline-none focus:border-[#C49A4A] focus:ring-2 focus:ring-[#C49A4A]/20"
                >
                  <option value="admin">Admin</option>
                  <option value="operator">Operator</option>
                  <option value="viewer">Viewer</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-xs font-medium text-[#5E5149]">
                Status
                <select
                  value={draft.status}
                  onChange={(event) => {
                    const status = event.target.value;
                    if (status === "Aktif" || status === "Suspended") {
                      setDraft({ ...draft, status });
                    }
                  }}
                  className="rounded-xl border border-[#D1C7BD] bg-white px-3 py-2.5 text-sm text-[#3D2018] outline-none focus:border-[#C49A4A] focus:ring-2 focus:ring-[#C49A4A]/20"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </label>
              <div className="mt-2 flex justify-end gap-2.5 sm:col-span-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-full border border-[#D1C7BD] px-5 py-2.5 text-xs font-semibold text-[#6D5D53] transition hover:bg-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#00B493] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#00977F]"
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
