import { Pencil, User } from "lucide-react";

export type AdminUserRowData = {
  id: number | string;
  role: string;
  email: string;
  username: string;
  access: "admin" | "user" | string;
  status: "Aktif" | "Suspended" | string;
};

type UserRowItemProps<T extends AdminUserRowData = AdminUserRowData> = {
  user: T;
  onEdit: (user: T) => void;
  onToggleStatus: (userId: T["id"]) => void;
};

export default function UserRowItem<T extends AdminUserRowData = AdminUserRowData>({
  user,
  onEdit,
  onToggleStatus,
}: UserRowItemProps<T>) {
  const isActive = user.status === "Aktif";

  return (
    <article className="grid grid-cols-[48px_minmax(140px,1.2fr)_minmax(180px,1.5fr)_minmax(140px,1.1fr)_minmax(110px,0.85fr)_minmax(115px,0.9fr)_minmax(160px,auto)] items-center gap-4 border-b border-[#EAE0CE]/70 px-5 py-3.5 transition-colors hover:bg-white/60 last:border-b-0 sm:px-6">
      {/* Kolom 1 (ID Bulat): Lingkaran krem (#EFE6D5 / #EAE0CE) berisi angka ID */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFE6D5] text-[11px] font-semibold text-[#7A5740]">
        {String(user.id).padStart(2, "0")}
      </div>

      {/* Kolom 2 (Nama & Sub-Role): Nama peran dalam bold dan di bawahnya teks sub-role uppercase kecil warna abu-abu */}
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-[#3D2018]">{user.role}</p>
        <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#9A8C80]">
          {user.access}
        </p>
      </div>

      {/* Kolom 3 (Email): Teks email rata kiri dengan warna abu-abu netral */}
      <div className="min-w-0">
        <p className="truncate text-xs text-[#6E6158]" title={user.email}>
          {user.email}
        </p>
      </div>

      {/* Kolom 4 (Username): Ikon user garis (User dari Lucide React) diikuti nama username */}
      <div className="flex min-w-0 items-center gap-1.5 text-xs text-[#6E6158]">
        <User size={13} className="shrink-0 text-[#A88B7A]" aria-hidden="true" />
        <span className="truncate">{user.username}</span>
      </div>

      {/* Kolom 5 (Badge Akses): Pill capsule background krem membulat sempurna (rounded-full bg-[#EFE6D5] px-6 py-1) berisi teks "Admin" atau "User" */}
      <div>
        <span className="inline-flex items-center justify-center rounded-full bg-[#EFE6D5] px-6 py-1 text-[11px] font-medium capitalize text-[#755C49]">
          {user.access?.toLowerCase() === "admin" ? "Admin" : "User"}
        </span>
      </div>

      {/* Kolom 6 (Status Badge): Titik hijau/merah (w-2 h-2 rounded-full) + teks status ("Aktif" hijau soft / "Suspended" merah pink) */}
      <div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
            isActive
              ? "bg-[#E8F7F1] text-[#007B67]"
              : "bg-[#FCE9E8] text-[#AD334A]"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isActive ? "bg-[#00B493]" : "bg-[#E34B68]"
            }`}
          />
          {user.status}
        </span>
      </div>

      {/* Kolom 7 (Tombol Aksi): Edit & Suspe / Aktifkan */}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onEdit(user)}
          aria-label={`Edit data ${user.username}`}
          className="inline-flex items-center gap-1 rounded-full bg-[#3D2018] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#2D1B14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D2018]"
        >
          <Pencil size={11} aria-hidden="true" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onToggleStatus(user.id)}
          aria-pressed={!isActive}
          aria-label={isActive ? `Suspend ${user.username}` : `Aktifkan ${user.username}`}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            isActive
              ? "bg-[#9B3D32] hover:bg-[#87352B]"
              : "bg-[#00B493] hover:bg-[#009B7E]"
          }`}
        >
          {isActive ? "Suspe" : "Aktifkan"}
        </button>
      </div>
    </article>
  );
}
