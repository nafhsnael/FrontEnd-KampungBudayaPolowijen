import Head from "next/head";
import { useState, type FormEvent } from "react";
import { Building2, CalendarDays, MapPinned, UsersRound } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

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
  { label: "UMKM", value: "50", icon: Building2, accent: "bg-[#EAF2EB] text-[#55765D]" },
  { label: "Event", value: "50", icon: CalendarDays, accent: "bg-[#F8EFE1] text-[#A77932]" },
  { label: "Paket Kunjungan", value: "50", icon: MapPinned, accent: "bg-[#F3EAE5] text-[#98634B]" },
];

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [draft, setDraft] = useState<UserRecord | null>(null);

  function openEdit(user: UserRecord) {
    setDraft({ ...user });
  }

  function closeEdit() {
    setDraft(null);
  }

  function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;

    setUsers((currentUsers) =>
      currentUsers.map((user) => (user.id === draft.id ? { ...draft } : user)),
    );
    closeEdit();
  }

  function toggleStatus(userId: number) {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "Aktif" ? "Suspended" : "Aktif" }
          : user,
      ),
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard Admin | Kampung Budaya Polowijen</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="flex min-h-screen bg-[#F5F4F0] font-sans text-[#342D27]">
        <AdminSidebar activeRoute="dashboard" />

        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:gap-8">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#A77932]">
                  Panel Admin
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-[#342D27] sm:text-3xl">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm text-[#827970]">
                  Ringkasan aktivitas Kampung Budaya Polowijen.
                </p>
              </div>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E7E2D9] bg-white px-3.5 py-2 text-xs font-medium text-[#6C635A] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#6F9876]" />
                Sistem aktif
              </div>
            </header>

            <section
              aria-label="Statistik ringkasan"
              className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6"
            >
              {STATISTICS.map(({ label, value, icon: Icon, accent }) => (
                <article
                  key={label}
                  className="group rounded-2xl border border-[#E9E5DD] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-sm font-medium text-[#827970]">{label}</h2>
                      <p className="mt-3 text-3xl font-bold tracking-tight text-[#342D27] sm:text-4xl">
                        {value}
                      </p>
                      <p className="mt-1 text-xs text-[#9A9188]">Total terdaftar</p>
                    </div>
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
                      <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                  </div>
                </article>
              ))}
            </section>

            <section className="overflow-hidden rounded-2xl border border-[#E9E5DD] bg-white shadow-sm">
              <header className="flex flex-col gap-3 border-b border-[#EEEAE4] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8EFE1] text-[#A77932]">
                    <UsersRound size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-[#342D27] sm:text-lg">Data User</h2>
                    <p className="mt-0.5 text-xs text-[#8A8178]">Ringkasan akun dan hak akses</p>
                  </div>
                </div>
                <span className="w-fit rounded-full bg-[#F5F4F0] px-3 py-1.5 text-xs font-medium text-[#71685F]">
                  {users.length} pengguna
                </span>
              </header>

              <div className="overflow-x-auto p-3 sm:p-5">
                <table className="w-full min-w-[960px] table-fixed border-separate border-spacing-0 text-left text-xs text-[#514A43]">
                  <colgroup>
                    <col className="w-[7%]" />
                    <col className="w-[16%]" />
                    <col className="w-[23%]" />
                    <col className="w-[17%]" />
                    <col className="w-[11%]" />
                    <col className="w-[11%]" />
                    <col className="w-[15%]" />
                  </colgroup>
                  <thead className="bg-[#F7F6F2] text-[#766D64]">
                    <tr>
                      <th scope="col" className="rounded-l-xl border-b border-[#ECE8E1] px-3 py-3 font-semibold">No</th>
                      <th scope="col" className="border-b border-[#ECE8E1] px-3 py-3 font-semibold">Role</th>
                      <th scope="col" className="border-b border-[#ECE8E1] px-3 py-3 font-semibold">Email</th>
                      <th scope="col" className="border-b border-[#ECE8E1] px-3 py-3 font-semibold">Username</th>
                      <th scope="col" className="border-b border-[#ECE8E1] px-3 py-3 font-semibold">Akses</th>
                      <th scope="col" className="border-b border-[#ECE8E1] px-3 py-3 font-semibold">Status</th>
                      <th scope="col" className="rounded-r-xl border-b border-[#ECE8E1] px-3 py-3 text-right font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="transition-colors hover:bg-[#FAF9F6]">
                        <td className="whitespace-nowrap border-b border-[#F0EDE8] px-3 py-3 text-[#9A9188]">{String(user.id).padStart(2, "0")}</td>
                        <td className="overflow-hidden text-ellipsis whitespace-nowrap border-b border-[#F0EDE8] px-3 py-3 font-medium text-[#403932]">{user.role}</td>
                        <td className="overflow-hidden text-ellipsis whitespace-nowrap border-b border-[#F0EDE8] px-3 py-3">{user.email}</td>
                        <td className="overflow-hidden text-ellipsis whitespace-nowrap border-b border-[#F0EDE8] px-3 py-3">{user.username}</td>
                        <td className="whitespace-nowrap border-b border-[#F0EDE8] px-3 py-3 capitalize">{user.access}</td>
                        <td className="whitespace-nowrap border-b border-[#F0EDE8] px-3 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              user.status === "Aktif"
                                ? "bg-[#E8F2E9] text-[#4F7958]"
                                : "bg-[#F9E9E6] text-[#AD5145]"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap border-b border-[#F0EDE8] px-3 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(user)}
                              aria-label={`Edit data ${user.username}`}
                              className="rounded-full bg-[#55765D] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#45644D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#55765D]"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleStatus(user.id)}
                              aria-pressed={user.status === "Suspended"}
                              aria-label={user.status === "Aktif" ? `Suspend ${user.username}` : `Aktifkan ${user.username}`}
                              className={`rounded-full px-3 py-1 text-[10px] font-semibold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                                user.status === "Aktif"
                                  ? "bg-[#B85D50] hover:bg-[#A84F43]"
                                  : "bg-[#55765D] hover:bg-[#45644D]"
                              }`}
                            >
                              {user.status === "Aktif" ? "Suspe" : "Aktifkan"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
            className="w-full max-w-xl rounded-3xl border border-[#E9E5DD] bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A77932]">Data pengguna</p>
                <h2 id="edit-user-title" className="text-xl font-bold text-[#342D27]">Edit User</h2>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                aria-label="Tutup modal"
                className="rounded-full border border-[#D1C7BD] px-3 py-1.5 text-sm text-[#3D2018] transition hover:bg-white"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={saveUser} className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-medium text-[#5E5149]">
                Role
                <input
                  required
                  value={draft.role}
                  onChange={(event) => setDraft({ ...draft, role: event.target.value })}
                  className="rounded-xl border border-[#D1C7BD] bg-white px-3 py-2.5 text-sm text-[#3D2018] outline-none focus:border-[#C59B4E] focus:ring-2 focus:ring-[#C59B4E]/20"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium text-[#5E5149]">
                Username
                <input
                  required
                  value={draft.username}
                  onChange={(event) => setDraft({ ...draft, username: event.target.value })}
                  className="rounded-xl border border-[#D1C7BD] bg-white px-3 py-2.5 text-sm text-[#3D2018] outline-none focus:border-[#C59B4E] focus:ring-2 focus:ring-[#C59B4E]/20"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium text-[#5E5149] sm:col-span-2">
                Email
                <input
                  required
                  type="email"
                  value={draft.email}
                  onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                  className="rounded-xl border border-[#D1C7BD] bg-white px-3 py-2.5 text-sm text-[#3D2018] outline-none focus:border-[#C59B4E] focus:ring-2 focus:ring-[#C59B4E]/20"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium text-[#5E5149]">
                Akses
                <select
                  value={draft.access}
                  onChange={(event) => {
                    const access = event.target.value;
                    if (access === "admin" || access === "user") {
                      setDraft({ ...draft, access });
                    }
                  }}
                  className="rounded-xl border border-[#D1C7BD] bg-white px-3 py-2.5 text-sm text-[#3D2018] outline-none focus:border-[#C59B4E] focus:ring-2 focus:ring-[#C59B4E]/20"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
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
                  className="rounded-xl border border-[#D1C7BD] bg-white px-3 py-2.5 text-sm text-[#3D2018] outline-none focus:border-[#C59B4E] focus:ring-2 focus:ring-[#C59B4E]/20"
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
                  className="rounded-full bg-[#C59B4E] px-5 py-2.5 text-xs font-semibold text-[#3D2018] transition hover:bg-[#B58B3F]"
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
