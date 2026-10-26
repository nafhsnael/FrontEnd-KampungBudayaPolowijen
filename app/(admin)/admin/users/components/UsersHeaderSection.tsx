import { ChevronDown, Filter, Search, ShieldCheck } from "lucide-react";

type UserStatus = "Aktif" | "Suspended";

type UsersHeaderSectionProps = {
  searchTerm: string;
  filter: "Semua" | UserStatus;
  filterOpen: boolean;
  onSearchChange: (value: string) => void;
  onFilterOpenChange: (open: boolean) => void;
  onFilterChange: (value: "Semua" | UserStatus) => void;
};

export default function UsersHeaderSection({
  searchTerm,
  filter,
  filterOpen,
  onSearchChange,
  onFilterOpenChange,
  onFilterChange,
}: UsersHeaderSectionProps) {
  return (
    <header className="border-b border-[#E8DDD1] px-5 py-5 sm:px-7 sm:py-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[#9B3D32]">
            <ShieldCheck size={18} aria-hidden="true" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
              Manajemen pengguna
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-wide text-[#3D2018]">Data User</h1>
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
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cari nama, role, email atau username..."
              className="min-w-0 flex-1 bg-transparent text-xs text-[#3D2018] outline-none placeholder:text-[#A89A8D]"
            />
          </label>

          <div className="relative">
            <button
              type="button"
              aria-label="Filter status pengguna"
              aria-expanded={filterOpen}
              onClick={() => onFilterOpenChange(!filterOpen)}
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
                      onFilterChange(option);
                      onFilterOpenChange(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                      filter === option
                        ? "bg-[#FAF3E0] text-[#3D2018]"
                        : "text-[#6F6259] hover:bg-[#F8F2EA]"
                    }`}
                  >
                    {option}
                    {filter === option && (
                      <ChevronDown size={14} className="-rotate-90" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
