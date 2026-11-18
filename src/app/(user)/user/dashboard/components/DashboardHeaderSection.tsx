"use client";

import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { label: "Beranda", href: "/user/dashboard" },
  { label: "Cerita kampung", href: "#komunitas" },
  { label: "Agenda", href: "#agenda" },
  { label: "UMKM", href: "/user/umkm" },
];

export default function DashboardHeaderSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="relative flex min-h-[76px] items-center justify-between border-b border-[#e5ded0] md:min-h-[92px]">
        <Link
          href="/user/dashboard"
          className="leading-tight"
          aria-label="Kampung Budaya Polowijen, beranda"
        >
          <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#9b3d32] md:text-[11px]">
            Kampung Budaya
          </span>
          <span className="mt-1 block text-[19px] font-extrabold md:text-[22px]">
            Polowijen
          </span>
        </Link>
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Navigasi utama"
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[13px] font-semibold text-[#5f584d] transition-colors hover:text-[#9b3d32]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center text-[#392b25] md:hidden"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      {menuOpen && (
        <nav
          className="grid gap-1 border-b border-[#e5ded0] py-3 md:hidden"
          aria-label="Menu mobile"
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-3 text-sm font-semibold text-[#51473d]"
            >
              {item.label}
              <ArrowRight size={16} className="text-[#9b3d32]" />
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
