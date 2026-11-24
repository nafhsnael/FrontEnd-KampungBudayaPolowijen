"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, type ReactNode } from "react";

export const inputClass =
  "w-full rounded-md border border-[#E7D9C4] bg-white px-3 py-2 text-sm text-[#3b2a22] outline-none focus:border-[#B8933F] focus:ring-2 focus:ring-[#B8933F]/30";

export const labelClass = "mb-1 block text-xs font-medium text-[#4A2A20]";

export function splitLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function PackageImage({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes: string;
}) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center text-[10px] text-[#4A2A20]/60">
        Belum ada gambar
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      draggable={false}
      unoptimized={src.startsWith("blob:")}
      className="select-none object-cover"
    />
  );
}

export function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function Modal({
  title,
  onClose,
  showClose = false,
  children,
}: {
  title: ReactNode;
  onClose: () => void;
  showClose?: boolean;
  children: ReactNode;
}) {
  // Esc menutup modal, scroll halaman di belakangnya dikunci
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[92vh] w-full max-w-[400px] overflow-y-auto rounded-2xl bg-[#FFF8EC] p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-base font-bold text-[#3b2a22]">{title}</h2>
          {showClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="rounded-full p-1 text-[#4A2A20] hover:bg-[#4A2A20]/10 focus-visible:outline-2 focus-visible:outline-[#B8933F]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}