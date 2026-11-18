import { Check, Pencil, Trash2, User, X } from "lucide-react";

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
  displayNumber?: number;
  onEdit: (user: T) => void;
  onToggleStatus: (userId: T["id"]) => void;
  onDelete: (user: T) => void;
};

export default function UserRowItem<T extends AdminUserRowData = AdminUserRowData>({
  user,
  displayNumber,
  onEdit,
  onToggleStatus,
  onDelete,
}: UserRowItemProps<T>) {
  const isActive = user.status === "Aktif";

  return (
    <article className="grid grid-cols-[24px_minmax(95px,1.1fr)_minmax(125px,1.35fr)_minmax(90px,1fr)_minmax(60px,.7fr)_minmax(72px,.8fr)_minmax(70px,auto)] items-center gap-1.5 border-b border-[#F0EBE5] px-3 py-2 transition-colors hover:bg-[#FFFCF7] last:border-b-0">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F4E9D9] text-[7px] font-semibold text-[#9B7658]">
        {String(displayNumber ?? user.id).padStart(2, "0")}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[8px] font-bold text-[#4A342A]">{user.role}</p>
        <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-wider text-[#9A8C80]">
          {user.access}
        </p>
      </div>

      <div className="min-w-0">
        <p className="truncate text-[8px] text-[#7B7068]" title={user.email}>
          {user.email}
        </p>
      </div>

      <div className="flex min-w-0 items-center gap-1 text-[8px] text-[#7B7068]">
        <User size={10} className="shrink-0 text-[#A88B7A]" aria-hidden="true" />
        <span className="truncate">{user.username}</span>
      </div>

      <div>
        <span className="inline-flex w-full items-center justify-center rounded-full bg-[#F1EAE0] px-1.5 py-1 text-[7px] font-medium capitalize text-[#755C49]">
          {user.access?.toLowerCase() === "admin" ? "Admin" : "User"}
        </span>
      </div>

      <div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-[7px] font-medium ${
            isActive
              ? "bg-[#E8F7F1] text-[#007B67]"
              : "bg-[#FCE9E8] text-[#AD334A]"
          }`}
        >
          <span
            className={`h-1 w-1 rounded-full ${
              isActive ? "bg-[#00B493]" : "bg-[#E34B68]"
            }`}
          />
          {user.status}
        </span>
      </div>

      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => onEdit(user)}
          aria-label={`Edit data ${user.username}`}
          className="inline-flex h-5 w-6 items-center justify-center rounded-md bg-[#12B99E] text-white transition-colors hover:bg-[#0D9C85] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D2018]"
        >
          <Pencil size={9} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onToggleStatus(user.id)}
          aria-pressed={!isActive}
          aria-label={isActive ? `Suspend ${user.username}` : `Aktifkan ${user.username}`}
          className={`inline-flex h-5 min-w-7 items-center justify-center rounded-md px-1 text-[7px] font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            isActive
              ? "bg-[#9B3D32] hover:bg-[#87352B]"
              : "bg-[#00B493] hover:bg-[#009B7E]"
          }`}
        >
          {isActive ? <X size={9} aria-hidden="true" /> : <Check size={9} aria-hidden="true" />}
        </button>
        <button
          type="button"
          onClick={() => onDelete(user)}
          aria-label={`Hapus ${user.username}`}
          className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-[#E7C4BD] text-[#9B3D32] hover:bg-[#FCE9E8]"
        >
          <Trash2 size={9} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
