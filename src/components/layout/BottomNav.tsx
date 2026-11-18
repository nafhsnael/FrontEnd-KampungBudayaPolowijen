"use client";

import { CalendarDays, House, ShoppingBag, UserRound, UsersRound } from "lucide-react";

export type BottomNavItem = "home" | "umkm" | "komunitas" | "agenda" | "profil";

type BottomNavProps = {
  activeItem?: BottomNavItem | string;
  onChange?: (item: BottomNavItem) => void;
};

const items: Array<{ id: BottomNavItem; label: string; icon: typeof House }> = [
  { id: "home", label: "Beranda", icon: House },
  { id: "komunitas", label: "Komunitas", icon: UsersRound },
  { id: "umkm", label: "Keranjang", icon: ShoppingBag },
  { id: "agenda", label: "Kalender", icon: CalendarDays },
  { id: "profil", label: "Profil", icon: UserRound },
];

export default function BottomNav({ activeItem = "home", onChange }: BottomNavProps) {
  const activeIndex = Math.max(0, items.findIndex(({ id }) => id === activeItem));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 w-screen max-w-none items-center justify-center overflow-visible border-t border-white/10 bg-[#9B3D32] px-4 text-white shadow-2xl sm:px-12" aria-label="Navigasi utama">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 z-0 h-14 w-14 -translate-x-1/2 rounded-full border-4 border-[#9B3D32] bg-[#FDF8F2] shadow-xl transition-all duration-300 ease-out sm:h-16 sm:w-16"
        style={{ left: `${((activeIndex + 0.5) / items.length) * 100}%` }}
      />
      {items.map(({ id, label, icon: Icon }) => {
        const isActive = activeItem === id;

        return (
          <button
            key={id}
            type="button"
            aria-current={isActive ? "page" : undefined}
            aria-label={label}
            onClick={() => onChange?.(id)}
            className={`relative z-10 flex h-full w-1/5 flex-col items-center justify-end gap-0.5 px-1 pb-1 transition-colors ${isActive ? "text-[#9B3D32]" : "text-white/85 hover:text-[#FDF8F2]"}`}
          >
            <span className={isActive ? "relative -top-4 flex items-center justify-center" : "flex items-center justify-center text-[#FDF8F2]"}>
              <Icon className={isActive ? "h-7 w-7 text-[#9B3D32] sm:h-8 sm:w-8" : "h-6 w-6 sm:h-7 sm:w-7"} strokeWidth={isActive ? 2.5 : 2} />
            </span>
            <span className="mt-0.5 text-[10px] font-semibold leading-none text-white/90 sm:text-xs">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
