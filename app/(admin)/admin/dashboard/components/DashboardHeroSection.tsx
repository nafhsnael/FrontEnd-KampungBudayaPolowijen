export default function DashboardHeroSection() {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#A77932]">
          Panel Admin
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[#342D27] sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#827970]">
          Ringkasan aktivitas Kampung Budaya Polowijen.
        </p>
      </div>
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E7E2D9] bg-white px-3.5 py-2 text-xs font-medium text-[#6C635A] shadow-sm">
        <span className="h-2 w-2 rounded-full bg-[#6F9876]" />
        Sistem aktif
      </div>
    </header>
  );
}
