type UserStatus = "Aktif" | "Suspended";

export default function UsersSummarySection({
  visibleCount,
  totalCount,
  filter,
}: {
  visibleCount: number;
  totalCount: number;
  filter: "Semua" | UserStatus;
}) {
  return (
    <section
      aria-label="Ringkasan daftar pengguna"
      className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8DDD1] bg-white/30 px-5 py-3 text-xs text-[#75685F] sm:px-7"
    >
      <p>
        Menampilkan{" "}
        <strong className="font-semibold text-[#3D2018]">{visibleCount}</strong> dari{" "}
        {totalCount} pengguna
      </p>
      <span className="rounded-full bg-[#E9F7F3] px-3 py-1 font-medium text-[#007B67]">
        Filter: {filter}
      </span>
    </section>
  );
}
