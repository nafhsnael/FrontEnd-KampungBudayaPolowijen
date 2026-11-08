import { Filter, Search, UsersRound } from "lucide-react";
import type { UserStatus } from "@/services/users";

type StatusFilter = "Semua" | UserStatus;

type AdminUsersHeaderProps = {
  searchTerm: string;
  statusFilter: StatusFilter;
  visibleCount: number;
  totalCount: number;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
};

export default function AdminUsersHeader({
  searchTerm,
  statusFilter,
  visibleCount,
  totalCount,
  isLoading,
  onSearchChange,
  onStatusFilterChange,
}: AdminUsersHeaderProps) {
  return (
    <header className="flex flex-col gap-3 border-b border-[#EAE0CE] bg-[#FAF3E0] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFE6D5] text-[#7A5740]">
          <UsersRound size={19} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-base font-bold text-[#3D2018] sm:text-lg">Data User</h1>
          <p className="mt-0.5 text-xs text-[#8A8178]">Ringkasan akun dan hak akses</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 rounded-full border border-[#D8CDBC] bg-[#FFFDF7] px-3.5 py-2 text-[#827970] shadow-sm focus-within:border-[#C59B4E]">
          <Search size={14} aria-hidden="true" />
          <span className="sr-only">Cari user</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari user..."
            className="w-full bg-transparent text-xs text-[#3D2018] outline-none placeholder:text-[#A59D94] sm:w-36"
          />
        </label>
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter size={14} className="text-[#827970]" aria-hidden="true" />
          {(["Semua", "Aktif", "Suspended"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onStatusFilterChange(status)}
              aria-pressed={statusFilter === status}
              className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition ${
                statusFilter === status
                  ? "bg-[#3D2018] text-white shadow-sm"
                  : "border border-[#E5DAC8] bg-[#FFFDF7] text-[#71685F] hover:bg-[#F5EDE0]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <span className="w-fit rounded-full border border-[#E5DAC8] bg-[#FFFDF7] px-3 py-1.5 text-xs font-medium text-[#71685F] shadow-sm">
          {isLoading
            ? "Memuat..."
            : visibleCount === totalCount
              ? `${totalCount} pengguna`
              : `${visibleCount} dari ${totalCount} pengguna`}
        </span>
      </div>
    </header>
  );
}
