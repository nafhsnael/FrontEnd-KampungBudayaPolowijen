"use client";

import Link from "next/link";
import { CalendarDays, Compass, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import RatingDialogSection from "./RatingDialogSection";

const shortcuts = [
  {
    label: "Jelajah budaya",
    description: "Cerita dan tradisi",
    icon: Compass,
    href: "#komunitas",
    tone: "bg-[#e9efe3] text-[#315642]",
  },
  {
    label: "UMKM lokal",
    description: "Karya warga",
    icon: ShoppingBag,
    href: "/umkm",
    tone: "bg-[#f5e7d4] text-[#a85a35]",
  },
  {
    label: "Agenda",
    description: "Aktivitas kampung",
    icon: CalendarDays,
    href: "#agenda",
    tone: "bg-[#e8e7f0] text-[#5d527b]",
  },
  {
    label: "Rating",
    description: "Bagikan kesanmu",
    icon: Star,
    tone: "bg-[#f6edcf] text-[#96721e]",
    action: "rating",
  },
];

export default function ExploreShortcutsSection() {
  const [ratingOpen, setRatingOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <section aria-labelledby="shortcut-heading">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9b3d32]">
          Mulai dari sini
        </p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <h2
            id="shortcut-heading"
            className="text-[20px] font-extrabold md:text-[24px]"
          >
            Jelajahi Polowijen
          </h2>
          <span className="hidden text-xs text-[#82766a] sm:block">
            Pilih pengalamanmu
          </span>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">
          {shortcuts.map(({ label, description, icon: Icon, href, tone, action }) => (
            <Link
              key={label}
              href={href ?? "#rating"}
              aria-haspopup={action === "rating" ? "dialog" : undefined}
              onClick={(event) => {
                if (action === "rating") {
                  event.preventDefault();
                  setSubmitted(false);
                  setRatingOpen(true);
                }
              }}
              className="group flex min-w-0 flex-col items-center text-center"
            >
              <span
                className={`flex aspect-square w-full max-w-[88px] items-center justify-center rounded-[8px] transition-transform group-hover:-translate-y-1 ${tone}`}
              >
                <Icon size={24} strokeWidth={1.9} />
              </span>
              <span className="mt-2.5 text-[10px] font-bold leading-tight sm:text-xs">
                {label}
              </span>
              <span className="mt-1 text-[9px] leading-tight text-[#82766a] sm:text-[10px]">
                {description}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <RatingDialogSection
        isOpen={ratingOpen}
        onClose={() => setRatingOpen(false)}
        rating={rating}
        submitted={submitted}
        onRatingChange={(nextRating) => {
          setRating(nextRating);
          setSubmitted(false);
        }}
        onSubmit={() => setSubmitted(true)}
      />
    </>
  );
}
