import type { LucideIcon } from "lucide-react";

type Statistic = {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
};

export default function DashboardStatisticsSection({
  statistics,
}: {
  statistics: Statistic[];
}) {
  return (
    <section
      aria-label="Statistik ringkasan"
      className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6"
    >
      {statistics.map(({ label, value, icon: Icon, accent }) => (
        <article
          key={label}
          className="group rounded-2xl border border-[#E9E5DD] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-medium text-[#827970]">{label}</h2>
              <p className="mt-3 text-3xl font-bold tracking-tight text-[#342D27] sm:text-4xl">
                {value}
              </p>
              <p className="mt-1 text-xs text-[#9A9188]">Total terdaftar</p>
            </div>
            <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
              <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
            </span>
          </div>
        </article>
      ))}
    </section>
  );
}
