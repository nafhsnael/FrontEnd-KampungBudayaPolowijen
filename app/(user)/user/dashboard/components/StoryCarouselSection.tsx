"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { blobAsset } from "@/lib/blob-assets";

const slides = [
  {
    image: blobAsset("/images/dashboard-topeng.jpg"),
    alt: "Pertunjukan Tari Topeng Malangan di Kampung Budaya Polowijen",
    label: "Warisan Malang",
    title: "Temukan cerita di balik setiap gerak.",
    copy: "Kenali tradisi yang tumbuh dan dijaga bersama warga.",
  },
  {
    image: blobAsset("/images/dashboard-festival-kampung.jpeg"),
    alt: "Warga dan penari berkumpul di Kampung Budaya Polowijen",
    label: "Ruang kebersamaan",
    title: "Budaya hidup saat dirayakan bersama.",
    copy: "Temui orang-orang dan kisah yang membuat Polowijen istimewa.",
  },
  {
    image: blobAsset("/images/dashboard-kupatan.png"),
    alt: "Warga membuat anyaman ketupat bersama",
    label: "Tradisi warga",
    title: "Belajar tradisi langsung dari sumbernya.",
    copy: "Ikuti kegiatan kampung dan bawa pulang pengalaman bermakna.",
  },
];

export default function StoryCarouselSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const moveToSlide = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const nextIndex = (index + slides.length) % slides.length;
    carousel.scrollTo({
      left: carousel.clientWidth * nextIndex,
      behavior: "smooth",
    });
    setActiveSlide(nextIndex);
  };

  const handleCarouselScroll = () => {
    const carousel = carouselRef.current;
    if (carousel) {
      setActiveSlide(Math.round(carousel.scrollLeft / carousel.clientWidth));
    }
  };

  return (
    <section
      aria-label="Cerita pilihan"
      className="relative mt-5 overflow-hidden rounded-[8px] bg-[#392a22] md:mt-8"
    >
      <div
        ref={carouselRef}
        onScroll={handleCarouselScroll}
        className="flex h-[min(76vw,420px)] min-h-[300px] max-h-[500px] snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] md:h-[480px] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
      >
        {slides.map((slide, index) => (
          <article
            key={slide.image}
            className="relative h-full min-w-full snap-start"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} dari ${slides.length}`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 1176px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#211711]/90 via-[#211711]/35 to-[#211711]/5 md:bg-gradient-to-r md:from-[#211711]/85 md:via-[#211711]/35 md:to-transparent" />
            <div className="absolute inset-x-0 bottom-0 max-w-[680px] p-5 pb-12 text-white sm:p-8 sm:pb-14 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:p-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1cf8c] md:text-xs">
                {slide.label}
              </p>
              <h1 className="mt-2 max-w-[570px] text-[29px] font-extrabold leading-[1.08] sm:text-[36px] md:text-[48px]">
                {slide.title}
              </h1>
              <p className="mt-3 max-w-[440px] text-[12px] leading-relaxed text-white/85 sm:text-sm md:mt-4 md:text-base">
                {slide.copy}
              </p>
              <Link
                href="#komunitas"
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#f1cf8c] md:mt-6 md:text-sm"
              >
                Kenali kampung <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between md:inset-x-6 md:bottom-6">
        <div className="flex items-center gap-2" aria-label="Pilih slide">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`Tampilkan slide ${index + 1}`}
              aria-pressed={activeSlide === index}
              onClick={() => moveToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                activeSlide === index ? "w-7 bg-[#f1cf8c]" : "w-2 bg-white/70"
              }`}
            />
          ))}
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            aria-label="Slide sebelumnya"
            onClick={() => moveToSlide(activeSlide - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#392a22]"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Slide berikutnya"
            onClick={() => moveToSlide(activeSlide + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#392a22]"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
