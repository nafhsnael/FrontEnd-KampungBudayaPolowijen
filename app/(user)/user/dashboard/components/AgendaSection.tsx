import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AgendaSection() {
  return (
    <section
      id="agenda"
      className="border-t border-[#e5ded0] pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9b3d32]">
        Ruang pengalaman
      </p>
      <h2 className="mt-1 text-[20px] font-extrabold leading-tight md:text-[24px]">
        Budaya yang bisa kamu rasakan
      </h2>
      <p className="mt-2 max-w-[520px] text-[12px] leading-[1.7] text-[#71665b] md:text-sm">
        Ikuti kegiatan bersama warga, kenali kesenian tradisional, dan temukan
        karya lokal yang lahir dari kreativitas kampung.
      </p>
      <Link
        href="/user/umkm"
        className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#9b3d32] md:text-sm"
      >
        Lihat karya UMKM <ArrowRight size={16} />
      </Link>
    </section>
  );
}
