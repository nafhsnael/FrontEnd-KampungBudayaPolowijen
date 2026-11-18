"use client";

import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Plus, RefreshCw, X } from "lucide-react";
import AdminUsersHeader from "./AdminUsersHeader";
import AdminUsersList from "./AdminUsersList";
import {
  createUserApi,
  deleteUserApi,
  fetchUsersFromApi,
  toggleUserStatusApi,
  updateUserApi,
  type UserAccess,
  type UserRecord,
  type UserStatus,
} from "../../services/users";

type UserFormState = {
  email: string;
  fullName: string;
  username: string;
  roleTitle: string;
  access: UserAccess;
  status: UserStatus;
  password: string;
};

const EMPTY_FORM: UserFormState = {
  email: "",
  fullName: "",
  username: "",
  roleTitle: "User",
  access: "user",
  status: "Aktif",
  password: "",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | UserStatus>("Semua");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<UserRecord | null>(null);
  const [form, setForm] = useState<UserFormState>(EMPTY_FORM);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await fetchUsersFromApi({ limit: 200 }));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Gagal memuat data user."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchUsersFromApi({ limit: 200 })
      .then((result) => {
        if (active) setUsers(result);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat data user."
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

  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesStatus =
        statusFilter === "Semua" || user.status === statusFilter;
      const matchesSearch =
        !query ||
        [user.fullName, user.role, user.email, user.username]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter, users]);

  function openCreateDialog() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogError(null);
    setDialogOpen(true);
  }

  function openEditDialog(user: UserRecord) {
    setEditing(user);
    setForm({
      email: user.email,
      fullName: user.fullName ?? "",
      username: user.username,
      roleTitle: user.roleTitle ?? user.role,
      access: user.access,
      status: user.status,
      password: "",
    });
    setDialogError(null);
    setDialogOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setDialogError(null);
    try {
      if (editing) {
        const updated = await updateUserApi(editing.id, {
          email: form.email.trim(),
          fullName: form.fullName.trim() || form.username.trim(),
          username: form.username.trim(),
          role: form.roleTitle,
          roleTitle: form.roleTitle,
          access: form.access,
          status: form.status,
        });
        setUsers((current) =>
          current.map((user) => (user.id === editing.id ? updated : user))
        );
      } else {
        await createUserApi({
          email: form.email.trim(),
          fullName: form.fullName.trim(),
          username: form.username.trim(),
          roleTitle: form.roleTitle,
          access: form.access,
          status: form.status,
          password: form.password,
        });
        await loadUsers();
      }

      setDialogOpen(false);
    } catch (saveError) {
      setDialogError(
        saveError instanceof Error ? saveError.message : "Gagal menyimpan user."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(userId: UserRecord["id"]) {
    const user = users.find((item) => item.id === userId);
    if (!user) return;

    const nextStatus: UserStatus =
      user.status === "Aktif" ? "Suspended" : "Aktif";
    setError(null);
    try {
      await toggleUserStatusApi(userId, nextStatus);
      setUsers((current) =>
        current.map((item) =>
          item.id === userId ? { ...item, status: nextStatus } : item
        )
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Gagal mengubah status user."
      );
    }
  }

  async function handleDeleteUser(user: UserRecord) {
    if (!window.confirm(`Hapus akun ${user.email}? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setError(null);
    try {
      await deleteUserApi(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus user."
      );
    }
  }

  function updateField<K extends keyof UserFormState>(
    key: K,
    value: UserFormState[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const activeCount = users.filter((user) => user.status === "Aktif").length;
  const adminCount = users.filter((user) => user.access === "admin").length;

  return (
    <section className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-[#E6DDD0] bg-white shadow-[0_3px_12px_rgba(74,41,31,.08)]">
      <AdminUsersHeader
        searchTerm={search}
        statusFilter={statusFilter}
        visibleCount={visibleUsers.length}
        totalCount={users.length}
        isLoading={loading}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="flex flex-col gap-2 border-b border-[#F0EBE5] bg-white px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[8px] text-[#958A81]">
          {activeCount} akun aktif <span className="px-1 text-[#D4C8BA]">·</span>
          {adminCount} administrator
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadUsers()}
            disabled={loading}
            aria-label="Muat ulang data user"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#E7DED2] text-[#8A6D57] hover:bg-[#F8F1E7] disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={openCreateDialog}
            className="inline-flex h-7 items-center justify-center gap-1.5 rounded-full bg-[#4A291F] px-3 text-[9px] font-semibold text-white hover:bg-[#633A2D]"
          >
            <Plus size={12} aria-hidden="true" />
            Tambah User
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mx-4 mt-3 rounded-lg bg-[#FFF2EF] px-3 py-2 text-[10px] text-[#9B3D32]">
          {error}
        </p>
      )}

      <div className="overflow-x-auto">
        <div className="hidden min-w-[690px] grid-cols-[24px_minmax(95px,1.1fr)_minmax(125px,1.35fr)_minmax(90px,1fr)_minmax(60px,.7fr)_minmax(72px,.8fr)_70px] items-center gap-1.5 border-b border-[#F0EBE5] bg-white px-3 py-2 text-[7px] font-semibold uppercase tracking-wide text-[#958A81] md:grid">
          <span>No</span>
          <span>Role</span>
          <span>Email</span>
          <span>Username</span>
          <span>Akses</span>
          <span>Status</span>
          <span className="text-right">Aksi</span>
        </div>
        <AdminUsersList
          users={visibleUsers}
          isLoading={loading}
          error={null}
          emptyMessage={
            users.length === 0
              ? "Belum ada data user."
              : "Tidak ada user yang cocok dengan pencarian."
          }
          onEdit={openEditDialog}
          onToggleStatus={(userId) => void handleToggleStatus(userId)}
          onDelete={(user) => void handleDeleteUser(user)}
        />
      </div>

      {dialogOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#2D1B14]/45 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setDialogOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-dialog-title"
            className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl border border-[#E6DCC9] bg-[#FBF4DF] p-4 shadow-[0_8px_30px_rgba(48,31,20,.18)]"
          >
            <header className="mb-3 flex items-start justify-between gap-4">
              <div>
                <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#B47C3B]">
                  DATA PENGGUNA
                </p>
                <h2 id="user-dialog-title" className="mt-0.5 text-[13px] font-bold text-[#4A342A]">
                  {editing ? "Edit User" : "Tambah User"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
                aria-label="Tutup formulir"
                className="rounded-full p-1 text-[9px] text-[#75685F] hover:bg-[#EFE6D5]"
              >
                <X size={13} aria-hidden="true" />
              </button>
            </header>

            {dialogError && (
              <p role="alert" className="mb-3 rounded-lg bg-[#FFF2EF] px-3 py-2 text-[9px] text-[#9B3D32]">
                {dialogError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <Field label="Role">
                  <select
                    value={form.roleTitle}
                    onChange={(event) => updateField("roleTitle", event.target.value)}
                    className={inputClassName}
                  >
                    {["Super Admin", "Admin Event", "Manajer UMKM", "Pengelola Paket", "User"].map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Username">
                  <input
                    required
                    minLength={2}
                    value={form.username}
                    onChange={(event) => updateField("username", event.target.value)}
                    className={inputClassName}
                  />
                </Field>
              </div>
              <Field label="Email">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className={inputClassName}
                />
              </Field>
              {!editing && (
                <Field label="Password (minimal 6 karakter)">
                  <input
                    required
                    type="password"
                    minLength={6}
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    className={inputClassName}
                  />
                </Field>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Field label="Akses">
                  <select
                    value={form.access}
                    onChange={(event) =>
                      updateField(
                        "access",
                        event.target.value === "admin" ? "admin" : "user"
                      )
                    }
                    className={inputClassName}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </Field>
                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target.value === "Suspended" ? "Suspended" : "Aktif"
                      )
                    }
                    className={inputClassName}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </Field>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                  className="h-7 rounded-full border border-[#D8CDBC] px-3 text-[9px] font-medium text-[#6D5D53] hover:bg-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="h-7 rounded-full bg-[#C7983D] px-4 text-[9px] font-semibold text-white hover:bg-[#A98136] disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : editing ? "Simpan perubahan" : "Buat User"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}

const inputClassName =
  "h-7 w-full rounded-md border border-[#E2D9CB] bg-white px-2 text-[9px] text-[#4A342A] outline-none focus:border-[#C49A4A]";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[8px] text-[#7C7066]">{label}</span>
      {children}
    </label>
  );
}
