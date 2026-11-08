type DataUserSummarySectionProps = {
  cacheWarning: string | null;
  error: string | null;
};

export default function DataUserSummarySection({
  cacheWarning,
  error,
}: DataUserSummarySectionProps) {
  return (
    <>
      {cacheWarning && (
        <p
          className="mx-5 mt-4 rounded-xl bg-amber-50 px-4 py-2.5 text-xs text-amber-800 sm:mx-6"
          role="status"
        >
          {cacheWarning}
        </p>
      )}
      {error && (
        <p
          className="mx-5 mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-xs text-rose-700 sm:mx-6"
          role="alert"
        >
          {error}
        </p>
      )}
    </>
  );
}
