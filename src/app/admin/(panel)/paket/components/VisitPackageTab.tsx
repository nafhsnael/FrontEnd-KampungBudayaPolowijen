"use client";

import { useState } from "react";
import AdminPackageSection from "./AdminPackageSection";
import AdminScheduleSection from "./AdminScheduleSection";

type Tab = "paket" | "jadwal";

const TABS: { key: Tab; label: string }[] = [
  { key: "paket", label: "Paket Kunjungan" },
  { key: "jadwal", label: "Jadwal Rutin" },
];

export default function VisitPackageTab() {
  const [tab, setTab] = useState<Tab>("paket");

  return (
    <section aria-label="Kelola paket kunjungan">
      <div role="tablist" className="grid grid-cols-2 border-b border-[#4A2A20]">
        {TABS.map(({ key, label }) => {
          const selected = tab === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(key)}
              className={`py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#B8933F] ${
                selected
                  ? "bg-[#4A2A20] text-white"
                  : "bg-transparent text-[#4A2A20] hover:bg-[#4A2A20]/5"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Keduanya tetap hidup di memori supaya state tidak hilang saat pindah tab */}
      <div hidden={tab !== "paket"}>
        <AdminPackageSection />
      </div>
      <div hidden={tab !== "jadwal"}>
        <AdminScheduleSection />
      </div>
    </section>
  );
}