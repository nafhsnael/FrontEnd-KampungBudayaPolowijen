"use client";

import Link from "next/link";
import {
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  RefreshCw,
  Ticket,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  AdminDashboardStats,
  fetchAdminDashboardStats,
} from "@/services/admin-content";
import {
  fetchUsersPageFromApi,
  toggleUserStatusApi,
  type UserListPagination,
  type UserRecord,
} from "@/services/users";

const STAT_CARDS = [
  {
    key: "totalUmkm",
    label: "UMKM",
    href: "/admin/umkm",
    note: "Total terdaftar",
    icon: Building2,
    tone: "bg-[#E7F1E8] text-[#5C8765]",
  },
  {
    key: "totalEvents",
    label: "EVENT",
    href: "/admin/events",
    note: "Total terdaftar",
    icon: CalendarDays,
    tone: "bg-[#F7EEDC] text-[#B98A3C]",
  },
  {
    key: "activePackages",
    label: "PAKET KUNJUNGAN",
    href: "/admin/paket",
    note: "Total terdaftar",
    icon: Ticket,
    tone: "bg-[#F5E8E3] text-[#B96E5A]",
  },
] as const;

export default function AdminDashboardContent() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [usersPagination, setUsersPagination] =
    useState<UserListPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<UserRecord["id"] | null>(
    null
  );

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setUsersLoading(true);
    setStatsError(null);
    setUsersError(null);

    const [statsResult, usersResult] = await Promise.allSettled([
      fetchAdminDashboardStats(),
      fetchUsersPageFromApi({ page: userPage, limit: 10 }),
    ]);

    if (statsResult.status === "fulfilled") {
      setStats(statsResult.value);
    } else {
      setStatsError(
        statsResult.reason instanceof Error
          ? statsResult.reason.message
          : "Gagal memuat statistik dashboard."
      );
    }

    if (usersResult.status === "fulfilled") {
      setUsers(usersResult.value.users);
      setUsersPagination(usersResult.value.pagination);
    } else {
      setUsers([]);
      setUsersPagination(null);
      setUsersError(
        usersResult.reason instanceof Error
          ? usersResult.reason.message
          : "Gagal memuat data user."
      );
    }

    setLoading(false);
    setUsersLoading(false);
  }, [userPage]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setStatsError(null);
    fetchAdminDashboardStats()
      .then((result) => {
        if (active) setStats(result);
      })
      .catch((error: unknown) => {
        if (active) {
          setStatsError(
            error instanceof Error
              ? error.message
              : "Gagal memuat statistik dashboard."
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

  useEffect(() => {
    let active = true;
    setUsersLoading(true);
    setUsersError(null);
    setUsers([]);

    fetchUsersPageFromApi({ page: userPage, limit: 10 })
      .then((result) => {
        if (!active) return;
        setUsers(result.users);
        setUsersPagination(result.pagination);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setUsersPagination(null);
        setUsersError(
          error instanceof Error ? error.message : "Gagal memuat data user."
        );
      })
      .finally(() => {
        if (active) setUsersLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userPage]);

  async function toggleStatus(user: UserRecord) {
    const status = user.status === "Aktif" ? "Suspended" : "Aktif";
    setUpdatingUserId(user.id);
    setUsersError(null);
    try {
      await toggleUserStatusApi(user.id, status);
      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, status } : item
        )
      );
    } catch (error) {
      setUsersError(
        error instanceof Error ? error.message : "Gagal mengubah status user."
      );
    } finally {
      setUpdatingUserId(null);
    }
  }

  return (
    <section className="mx-auto max-w-6xl">
      <header className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8D6753]">
            PANEL ADMIN
          </p>
          <h1 className="mt-1 text-[22px] font-extrabold leading-tight text-[#43271E]">
            DASHBOARD
          </h1>
          <p className="mt-0.5 text-[10px] text-[#8D8278]">
            Ringkasan aktivitas Kampung Budaya Polowijen.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#E8DDCA] bg-white px-3 py-1.5 text-[9px] text-[#82776D]">
          <span className="h-2 w-2 rounded-full bg-[#39AD92]" />
          Sistem Aktif
        </div>
      </header>

      {statsError && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-[#E9C9C1] bg-[#FFF2EF] px-4 py-2.5 text-xs text-[#9B3D32]"
        >
          <span>{statsError}</span>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="inline-flex items-center gap-1 font-semibold"
          >
            <RefreshCw size={13} aria-hidden="true" />
            Coba lagi
          </button>
        </div>
      )}

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {STAT_CARDS.map(({ key, label, href, note, icon: Icon, tone }) => {
          const value = stats?.[key];
          return (
            <Link
              key={key}
              href={href}
              className="flex min-h-[78px] items-center justify-between rounded-xl border border-[#E8E0D5] bg-white px-4 py-3 shadow-[0_1px_4px_rgba(74,41,31,.08)] transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div>
                <p className="text-[9px] font-semibold text-[#91867E]">
                  {label}
                </p>
                <p className="mt-1 text-[24px] font-bold leading-none text-[#3E302A]">
                  {loading
                    ? "—"
                    : value === null || value === undefined
                      ? "—"
                      : value}
                </p>
                <p className="mt-1 text-[8px] text-[#AAA19A]">{note}</p>
              </div>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${tone}`}
              >
                <Icon size={15} aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-xl border border-[#E8E0D5] bg-white shadow-[0_2px_8px_rgba(74,41,31,.08)]">
        <header className="flex items-center justify-between gap-3 border-b border-[#EFE9E1] px-3 py-3 sm:px-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F6EBD8] text-[#BA8B42]">
              <UsersRound size={15} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-[12px] font-bold text-[#4A342A]">Data User</h2>
              <p className="text-[8px] text-[#9A9087]">
                Ringkasan akun dan hak akses
              </p>
            </div>
          </div>
          <Link
            href="/admin/data-user"
            className="rounded-full bg-[#F7F4EF] px-3 py-1 text-[8px] text-[#8A7F75] hover:bg-[#EFE8DE]"
          >
            Lihat semua
          </Link>
        </header>

        {usersError && (
          <div
            role="alert"
            className="mx-3 mt-3 flex items-center justify-between gap-3 rounded-md bg-[#FFF2EF] px-3 py-2 text-[10px] text-[#9B3D32] sm:mx-4"
          >
            {usersError}
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="shrink-0 font-semibold"
            >
              Coba lagi
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[690px] table-fixed text-left">
            <thead className="border-b border-[#F0EBE5] text-[8px] text-[#958A81]">
              <tr>
                <th className="w-10 px-3 py-2 font-medium">No</th>
                <th className="w-[18%] px-2 py-2 font-medium">Role</th>
                <th className="w-[22%] px-2 py-2 font-medium">Email</th>
                <th className="w-[18%] px-2 py-2 font-medium">Username</th>
                <th className="w-[15%] px-2 py-2 font-medium">Akses</th>
                <th className="w-[13%] px-2 py-2 font-medium">Status</th>
                <th className="w-[110px] px-2 py-2 text-right font-medium">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EEE9]">
              {usersLoading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-8 text-center text-[10px] text-[#8D8278]"
                  >
                    Memuat data user...
                  </td>
                </tr>
              )}
              {!usersLoading && users.length === 0 && !usersError && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-8 text-center text-[10px] text-[#8D8278]"
                  >
                    Belum ada pengguna.
                  </td>
                </tr>
              )}
              {users.map((user, index) => {
                const active = user.status === "Aktif";
                return (
                  <tr
                    key={user.id}
                    className="text-[8px] text-[#685A51] hover:bg-[#FFFCF7]"
                  >
                    <td className="px-3 py-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F4E9D9] text-[7px] text-[#9B7658]">
                        {String((userPage - 1) * 10 + index + 1).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <span className="font-semibold text-[#4A342A]">
                        {user.roleTitle ?? user.role}
                      </span>
                      <span className="mt-0.5 block text-[7px] uppercase text-[#A59A90]">
                        {user.access}
                      </span>
                    </td>
                    <td className="truncate px-2 py-2" title={user.email}>
                      {user.email}
                    </td>
                    <td className="truncate px-2 py-2">
                      <span className="inline-flex items-center gap-1">
                        <UserRound
                          size={10}
                          className="text-[#AA917E]"
                          aria-hidden="true"
                        />
                        {user.username}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <span className="inline-flex min-w-16 justify-center rounded-full bg-[#F1EAE0] px-2 py-1 text-[7px] capitalize text-[#7D6858]">
                        {user.access === "admin" ? "Admin" : "Viewer"}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[7px] ${
                          active
                            ? "bg-[#E6F7F1] text-[#078B76]"
                            : "bg-[#FCE9EF] text-[#D64067]"
                        }`}
                      >
                        <span
                          className={`h-1 w-1 rounded-full ${
                            active ? "bg-[#1CB898]" : "bg-[#E34B68]"
                          }`}
                        />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href="/admin/data-user"
                          aria-label={`Edit ${user.username}`}
                          className="inline-flex h-5 w-6 items-center justify-center rounded-md bg-[#12B99E] text-white hover:bg-[#0D9C85]"
                        >
                          <Pencil size={9} aria-hidden="true" />
                        </Link>
                        <button
                          type="button"
                          disabled={updatingUserId === user.id}
                          onClick={() => void toggleStatus(user)}
                          aria-label={
                            active
                              ? `Suspend ${user.username}`
                              : `Aktifkan ${user.username}`
                          }
                          className={`inline-flex h-5 min-w-8 items-center justify-center rounded-md px-1 text-[7px] text-white disabled:opacity-50 ${
                            active
                              ? "bg-[#F25261] hover:bg-[#D84150]"
                              : "bg-[#12B99E] hover:bg-[#0D9C85]"
                          }`}
                        >
                          {active ? (
                            <X size={9} aria-hidden="true" />
                          ) : (
                            <Check size={9} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <footer className="flex items-center justify-between gap-3 border-t border-[#EFE9E1] px-3 py-2.5 sm:px-4">
            <p className="text-[8px] text-[#8A8178]" aria-live="polite">
              Halaman {userPage} dari {Math.max(usersPagination?.totalPages ?? 0, 1)}
              {usersPagination ? ` · ${usersPagination.total} user` : ""}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setUserPage((page) => Math.max(page - 1, 1))}
                disabled={usersLoading || userPage <= 1}
                aria-label="Halaman user sebelumnya"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#E7DED2] text-[#827970] hover:bg-[#F7F4EF] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={13} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setUserPage((page) =>
                    Math.min(page + 1, usersPagination?.totalPages ?? page),
                  )
                }
                disabled={
                  usersLoading ||
                  userPage >= (usersPagination?.totalPages ?? userPage)
                }
                aria-label="Halaman user berikutnya"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#E7DED2] text-[#827970] hover:bg-[#F7F4EF] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={13} aria-hidden="true" />
              </button>
            </div>
        </footer>
      </section>
    </section>
  );
}
