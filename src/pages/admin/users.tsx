"use client";

import Head from "next/head";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ChevronDown, Filter, Pencil, Search, ShieldCheck, UserRound, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

type UserStatus = "Aktif" | "Suspended";

type UserRecord = {
  id: number;
  role: string;
  email: string;
  username: string;
  access: "admin" | "operator" | "viewer";
  status: UserStatus;
};

const USERS: UserRecord[] = [
  { id: 1, role: "Super Admin", email: "admin@kambudpolo.com", username: "admin_utama", access: "admin", status: "Aktif" },
  { id: 2, role: "Manajer UMKM", email: "umkm@kambudpolo.com", username: "manajer_umkm", access: "operator", status: "Aktif" },
  { id: 3, role: "Admin Event", email: "event@kambudpolo.com", username: "event_admin", access: "admin", status: "Aktif" },
  { id: 4, role: "Pengelola Paket", email: "paket@kambudpolo.com", username: "paket_admin", access: "operator", status: "Suspended" },
  { id: 5, role: "Pembaca", email: "pembaca@kambudpolo.com", username: "pembaca1", access: "viewer", status: "Aktif" },
  { id: 6, role: "Manajer UMKM", email: "budi@kambudpolo.com", username: "budi_santoso", access: "operator", status: "Aktif" },
  { id: 7, role: "Admin Event", email: "sari@kambudpolo.com", username: "sari_widiyanti", access: "admin", status: "Aktif" },
  { id: 8, role: "Pembaca", email: "dimas@kambudpolo.com", username: "dimas_putri", access: "viewer", status: "Suspended" },
  { id: 9, role: "Manajer UMKM", email: "arif@kambudpolo.com", username: "arif_pratama", access: "operator", status: "Aktif" },
  { id: 10, role: "Pengelola Paket", email: "maya@kambudpolo.com", username: "maya_lestari", access: "operator", status: "Aktif" },
  { id: 11, role: "Super Admin", email: "putri@kambudpolo.com", username: "putri_admin", access: "admin", status: "Aktif" },
  { id: 12, role: "Pembaca", email: "rudi@kambudpolo.com", username: "rudi_wahidin", access: "viewer", status: "Aktif" },
  { id: 13, role: "Admin Event", email: "nisa@kambudpolo.com", username: "nisa_azizah", access: "admin", status: "Aktif" },
  { id: 14, role: "Manajer UMKM", email: "fajar@kambudpolo.com", username: "fajar_ramadhan", access: "operator", status: "Suspended" },
  { id: 15, role: "Pengelola Paket", email: "indah@kambudpolo.com", username: "indah_sari", access: "operator", status: "Aktif" },
  { id: 16, role: "Pembaca", email: "dian@kambudpolo.com", username: "dian_mayanti", access: "viewer", status: "Aktif" },
  { id: 17, role: "Admin Event", email: "rio@kambudpolo.com", username: "rio_pratama", access: "admin", status: "Aktif" },
  { id: 18, role: "Manajer UMKM", email: "tari@kambudpolo.com", username: "tari_puspita", access: "operator", status: "Aktif" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"Semua" | UserStatus>("Semua");
  const [filterOpen, setFilterOpen] = useState(false);
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
      const matchesFilter = filter === "Semua" || user.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [filter, searchTerm, users]);

  function openEdit(user: UserRecord) {
    setEditingUser(user);
    setDraft({ ...user });
  }

  function closeEdit() {
    setEditingUser(null);
    setDraft(null);
  }

  function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;

    setUsers((current) =>
      current.map((user) => (user.id === draft.id ? { ...draft } : user)),
    );
    closeEdit();
  }

  function toggleStatus(userId: number) {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "Aktif" ? "Suspended" : "Aktif" }
          : user,
      ),
    );
  }

  return (
    <>
      <Head>
        <title>Data User | Kampung Budaya Polowijen</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="flex min-h-screen bg-[#FAF3E0] font-sans">
        <AdminSidebar activeRoute="users" />

        <main className="flex-1 p-6 overflow-y-auto lg:p-8">
        <section className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[#D1C7BD] bg-[#FDF8F2] shadow-md">
          <header className="border-b border-[#E8DDD1] px-5 py-5 sm:px-7 sm:py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[#9B3D32]">
                  <ShieldCheck size={18} aria-hidden="true" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                    Manajemen pengguna
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-wide text-[#3D2018]">
                  Data User
                </h1>
                <p className="mt-1 text-sm text-[#75685F]">
                  Kelola identitas, akses, dan status pengguna secara terstruktur.
                </p>
              </div>

              <div className="flex w-full items-center gap-2.5 lg:w-auto">
                <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full border border-[#D1C7BD] bg-white/80 px-4 py-2.5 text-[#8A7B70] shadow-sm transition focus-within:border-[#C49A4A] focus-within:ring-2 focus-within:ring-[#C49A4A]/20 lg:w-72">
                  <Search size={16} aria-hidden="true" />
                  <span className="sr-only">Cari pengguna</span>
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Cari nama, role, email atau username..."
                    className="min-w-0 flex-1 bg-transparent text-xs text-[#3D2018] outline-none placeholder:text-[#A89A8D]"
                  />
                </label>

                <div className="relative">
                  <button
                    type="button"
                    aria-label="Filter status pengguna"
                    aria-expanded={filterOpen}
                    onClick={() => setFilterOpen((open) => !open)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D1C7BD] bg-white text-[#3D2018] transition hover:bg-[#FAF3E0]"
                  >
                    <Filter size={16} aria-hidden="true" />
                  </button>

                  {filterOpen && (
                    <div className="absolute right-0 top-12 z-30 w-44 rounded-2xl border border-[#E8DDD1] bg-white p-1.5 shadow-lg">
                      {(["Semua", "Aktif", "Suspended"] as const).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setFilter(option);
                            setFilterOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                            filter === option
                              ? "bg-[#FAF3E0] text-[#3D2018]"
                              : "text-[#6F6259] hover:bg-[#F8F2EA]"
                          }`}
                        >
                          {option}
                          {filter === option && <ChevronDown size={14} className="-rotate-90" aria-hidden="true" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8DDD1] bg-white/30 px-5 py-3 text-xs text-[#75685F] sm:px-7">
            <p>
              Menampilkan <strong className="font-semibold text-[#3D2018]">{filteredUsers.length}</strong> dari {users.length} pengguna
            </p>
            <span className="rounded-full bg-[#E9F7F3] px-3 py-1 font-medium text-[#007B67]">
              Filter: {filter}
            </span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-230">
              {filteredUsers.map((user, index) => (
                <div
                  key={user.id}
                  className={`grid grid-cols-[72px_1fr_1.35fr_1fr_0.8fr_0.65fr_auto] items-center gap-4 px-5 py-3.5 text-xs transition sm:px-7 ${
                    index % 2 === 0 ? "bg-white/25" : "bg-[#FFFDF9]/60"
                  } hover:bg-white/80`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0E3D4] text-[10px] font-semibold text-[#7A5740]">
                    {String(user.id).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#3D2018]">{user.role}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wide text-[#9A8C80]">
                      {user.access}
                    </p>
                  </div>

                  <span className="truncate text-[#6E6158]">{user.email}</span>

                  <span className="flex min-w-0 items-center gap-1.5 text-[#6E6158]">
                    <UserRound size={13} className="shrink-0 text-[#A88B7A]" aria-hidden="true" />
                    <span className="truncate">{user.username}</span>
                  </span>

                  <span className="rounded-full bg-[#F0E8DE] px-2.5 py-1 text-center text-[10px] font-medium capitalize text-[#755C49]">
                    {user.access}
                  </span>

                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                      user.status === "Aktif"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        user.status === "Aktif" ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    {user.status}
                  </span>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(user)}
                      className="inline-flex items-center gap-1 rounded-full bg-[#00B493] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#00977F]"
                    >
                      <Pencil size={11} aria-hidden="true" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(user.id)}
                      className={`rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${
                        user.status === "Aktif"
                          ? "bg-[#FF4D4D] text-white hover:bg-[#E83F3F]"
                          : "bg-[#E9F7F3] text-[#007B67] hover:bg-[#D9F1EB]"
                      }`}
                    >
                      {user.status === "Aktif" ? "Suspe" : "Aktifkan"}
                    </button>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="flex min-h-52 flex-col items-center justify-center px-5 py-10 text-center">
                  <UserRound size={28} className="mb-3 text-[#C8B9AA]" aria-hidden="true" />
                  <p className="text-sm font-medium text-[#3D2018]">Pengguna tidak ditemukan</p>
                  <p className="mt-1 text-xs text-[#8A7B70]">
                    Coba kata kunci lain atau ubah filter status.
                  </p>
                </div>
              )}
            </div>
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
                Role / Nama
                <input
                  required
                  value={draft.role}
                  onChange={(event) => setDraft({ ...draft, role: event.target.value })}
                  className="rounded-xl border border-[#D1C7BD] bg-white px-3 py-2.5 text-xs text-[#3D2018] outline-none focus:border-[#C49A4A] focus:ring-2 focus:ring-[#C49A4A]/20"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium text-[#5E5149]">
                Username
                <input
                  required
                  value={draft.username}
                  onChange={(event) => setDraft({ ...draft, username: event.target.value })}
                  className="rounded-xl border border-[#D1C7BD] bg-white px-3 py-2.5 text-xs text-[#3D2018] outline-none focus:border-[#C49A4A] focus:ring-2 focus:ring-[#C49A4A]/20"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium text-[#5E5149] sm:col-span-2">
                Email
                <input
                  required
                  type="email"
                  value={draft.email}
                  onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                  className="rounded-xl border border-[#D1C7BD] bg-white px-3 py-2.5 text-xs text-[#3D2018] outline-none focus:border-[#C49A4A] focus:ring-2 focus:ring-[#C49A4A]/20"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium text-[#5E5149]">
                Tipe akses
                <select
                  value={draft.access}
                  onChange={(event) => setDraft({ ...draft, access: event.target.value as UserRecord["access"] })}
                  className="rounded-xl border border-[#D1C7BD] bg-white px-3 py-2.5 text-xs text-[#3D2018] outline-none focus:border-[#C49A4A] focus:ring-2 focus:ring-[#C49A4A]/20"
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
                  onChange={(event) => setDraft({ ...draft, status: event.target.value as UserStatus })}
                  className="rounded-xl border border-[#D1C7BD] bg-white px-3 py-2.5 text-xs text-[#3D2018] outline-none focus:border-[#C49A4A] focus:ring-2 focus:ring-[#C49A4A]/20"
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

      <style jsx global>{`
        body {
          font-family: Poppins, sans-serif;
        }
      `}</style>
    </>
  );
}
