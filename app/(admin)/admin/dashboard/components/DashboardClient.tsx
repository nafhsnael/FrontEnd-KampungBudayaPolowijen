"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Building2, CalendarDays, MapPinned } from "lucide-react";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminUsersHeader from "@/app/components/admin/AdminUsersHeader";
import AdminUsersList from "@/app/components/admin/AdminUsersList";
import DashboardHeroSection from "./DashboardHeroSection";
import DashboardStatisticsSection from "./DashboardStatisticsSection";

type UserStatus = "Aktif" | "Suspended";

type UserRecord = {
  id: number;
  role: string;
  email: string;
  username: string;
  access: "admin" | "user";
  status: UserStatus;
};

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
];

const STATISTICS = [
  { label: "UMKM", value: "8", icon: Building2, accent: "bg-[#EAF2EB] text-[#55765D]" },
  { label: "Event", value: "7", icon: CalendarDays, accent: "bg-[#F8EFE1] text-[#A77932]" },
  { label: "Paket Kunjungan", value: "4", icon: MapPinned, accent: "bg-[#F3EAE5] text-[#98634B]" },
];

type DashboardData = {
  users: UserRecord[];
  statistics: typeof STATISTICS;
};

const DASHBOARD_CACHE_TTL = 60_000;
const EMPTY_USERS: UserRecord[] = [];

const dashboardCache: {
  data: DashboardData | null;
  expiresAt: number;
  request: Promise<DashboardData> | null;
} = {
  data: null,
  expiresAt: 0,
  request: null,
};

async function fetchDashboardData(): Promise<DashboardData> {
  // Mock data source until the dashboard API is available.
  return {
    users: INITIAL_USERS.map((user) => ({ ...user })),
    statistics: STATISTICS,
  };
}

function getCachedDashboardData(): Promise<DashboardData> {
  if (dashboardCache.data && Date.now() < dashboardCache.expiresAt) {
    return Promise.resolve(dashboardCache.data);
  }

  if (dashboardCache.request) {
    return dashboardCache.request;
  }

  dashboardCache.request = fetchDashboardData()
    .then((data) => {
      dashboardCache.data = data;
      dashboardCache.expiresAt = Date.now() + DASHBOARD_CACHE_TTL;
      return data;
    })
    .finally(() => {
      dashboardCache.request = null;
    });

  return dashboardCache.request;
}

function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getCachedDashboardData()
      .then((result) => {
        if (isMounted) setData(result);
      })
      .catch((fetchError: unknown) => {
        if (isMounted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Data dashboard gagal dimuat.",
          );
        }
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
      if (!data) return;

      const nextData: DashboardData = {
        ...data,
        users: data.users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user,
        ),
      };
      dashboardCache.data = nextData;
      dashboardCache.expiresAt = Date.now() + DASHBOARD_CACHE_TTL;
      setData(nextData);
    },
    [data],
  );

  return { data, isLoading, error, updateUser };
}

export default function AdminDashboardPage() {
  const { data, isLoading, error, updateUser } = useDashboardData();
  const users = data?.users ?? EMPTY_USERS;
  const statistics = data?.statistics ?? STATISTICS;
  const [draft, setDraft] = useState<UserRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | UserStatus>("Semua");

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return users.filter((user) =>
      (statusFilter === "Semua" || user.status === statusFilter) &&
      (!query || `${user.role} ${user.email} ${user.username} ${user.access} ${user.status}`
        .toLowerCase()
        .includes(query)),
    );
  }, [searchTerm, statusFilter, users]);

  function openEdit(user: UserRecord) {
    setDraft({ ...user });
  }

  function closeEdit() {
    setDraft(null);
  }

  function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;

    updateUser(draft);
    closeEdit();
  }

  function toggleStatus(userId: number) {
    const user = users.find((currentUser) => currentUser.id === userId);
    if (!user) return;

    updateUser({
      ...user,
      status: user.status === "Aktif" ? "Suspended" : "Aktif",
    });
  }

  return (
    <>
      <div className="flex min-h-screen bg-[#F5F4F0] font-sans text-[#342D27]">
        <AdminSidebar activeRoute="dashboard" />

        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:gap-8">
            <DashboardHeroSection />
            <DashboardStatisticsSection statistics={statistics} />

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
