type DataUserSummarySectionProps = {
  visibleCount: number;
  totalCount: number;
  isLoading: boolean;
  cacheWarning: string | null;
  error: string | null;
};

export default function DataUserSummarySection({
  visibleCount,
  totalCount,
  isLoading,
  cacheWarning,
  error,
}: DataUserSummarySectionProps) {
  return (
    <>
      <section
        aria-label="Ringkasan data user"
        className="flex items-center justify-between px-5 py-3 sm:px-7"
      >
        <p className="text-xs text-[#75685F]">
          {isLoading ? "Memuat data user..." : `${visibleCount} user ditampilkan`}
        </p>
        <p className="text-xs text-[#8A7B70]">{totalCount} total user</p>
      </section>
      {cacheWarning && (
        <p
          className="mx-5 mb-3 rounded-xl bg-amber-50 px-4 py-2.5 text-xs text-amber-800 sm:mx-7"
          role="status"
        >
          {cacheWarning}
        </p>
      )}
      {error && (
        <p
          className="mx-5 mb-3 rounded-xl bg-rose-50 px-4 py-2.5 text-xs text-rose-700 sm:mx-7"
          role="alert"
        >
          {error}
        </p>
      )}
    </>
  );
}
