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
    <header className="flex flex-col gap-3 border-b border-[#F0EBE5] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8EAE5] text-[#B85B49]">
          <UsersRound size={15} aria-hidden="true" />
        </span>
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#BD8660]">
            Manajemen Pengguna
          </p>
          <h1 className="text-[13px] font-bold text-[#4A342A]">Data User</h1>
          <p className="mt-0.5 text-[8px] text-[#9A9087]">
            Ringkasan akun dan hak akses
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 rounded-full border border-[#E7DED2] bg-[#FFFCF7] px-3 py-1.5 text-[#827970] focus-within:border-[#C59B4E]">
          <Search size={12} aria-hidden="true" />
          <span className="sr-only">Cari user</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari user..."
            className="w-full bg-transparent text-[9px] text-[#3D2018] outline-none placeholder:text-[#A59D94] sm:w-32"
          />
        </label>
        <label className="flex items-center gap-1.5 rounded-full border border-[#E7DED2] bg-[#FFFCF7] px-2.5 py-1.5 text-[#827970]">
          <Filter size={11} aria-hidden="true" />
          <span className="sr-only">Filter status</span>
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as StatusFilter)
            }
            className="max-w-[82px] bg-transparent text-[9px] text-[#71685F] outline-none"
          >
            <option value="Semua">Semua</option>
            <option value="Aktif">Aktif</option>
            <option value="Suspended">Suspended</option>
          </select>
        </label>
        <span className="w-fit text-[8px] text-[#8A8178]">
          {isLoading
            ? "Memuat..."
            : visibleCount === totalCount
              ? `${totalCount} pengguna`
              : `${visibleCount} / ${totalCount}`}
        </span>
      </div>
    </header>
  );
}
