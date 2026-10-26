import { Filter, Search, ShieldCheck } from "lucide-react";

type UserStatus = "Aktif" | "Suspended";

type DataUserHeaderSectionProps = {
  searchTerm: string;
  statusFilter: "Semua" | UserStatus;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: "Semua" | UserStatus) => void;
};

export default function DataUserHeaderSection({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: DataUserHeaderSectionProps) {
  return (
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
            onChange={(event) => onSearchChange(event.target.value)}
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
              onClick={() => onStatusFilterChange(status)}
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
  );
}
