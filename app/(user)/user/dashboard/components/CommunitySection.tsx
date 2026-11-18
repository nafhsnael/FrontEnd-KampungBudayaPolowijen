import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { blobAsset } from "@/lib/blob-assets";

export default function CommunitySection() {
  return (
    <section
      id="komunitas"
      className="mt-10 grid items-center gap-6 border-t border-[#e5ded0] py-8 md:grid-cols-[0.85fr_1.15fr] md:gap-12 md:py-12"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-[#e9e2d4] md:aspect-[4/3]">
        <Image
          src={blobAsset("/images/dashboard-kupatan.png")}
          alt="Warga membuat anyaman ketupat bersama"
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover"
        />
      </div>
      <div className="max-w-[600px]">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9b3d32]">
          Cerita dari kampung
        </p>
        <h2 className="mt-2 text-[25px] font-extrabold leading-tight md:text-[34px]">
          Budaya yang terus hidup
        </h2>
        <p className="mt-3 text-[13px] leading-[1.8] text-[#71665b] md:text-[15px]">
          Di Polowijen, tradisi tumbuh dari kebersamaan warga. Gerak Tari Topeng
          Malangan, keterampilan para perajin, dan cerita yang diwariskan lintas
          generasi memberi makna pada setiap sudut kampung. Datanglah untuk
          mengenal budaya Malang dari dekat, bertemu warganya, dan merasakan
          suasana yang hangat.
        </p>
        <Link
          href="#agenda"
          className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#315642] md:text-sm"
        >
          Jelajahi kegiatan <ChevronDown size={16} />
        </Link>
      </div>
    </section>
  );
}
