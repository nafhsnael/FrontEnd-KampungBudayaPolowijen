import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, ChevronDown, Compass, Menu, ShoppingBag, Star, X } from "lucide-react";

const slides = [
	{
		image: "/images/dashboard-topeng.jpg",
		alt: "Pertunjukan Tari Topeng Malangan di Kampung Budaya Polowijen",
		label: "Warisan Malang",
		title: "Temukan cerita di balik setiap gerak.",
		copy: "Kenali tradisi yang tumbuh dan dijaga bersama warga.",
	},
	{
		image: "/images/dashboard-festival-kampung.jpeg",
		alt: "Warga dan penari berkumpul di Kampung Budaya Polowijen",
		label: "Ruang kebersamaan",
		title: "Budaya hidup saat dirayakan bersama.",
		copy: "Temui orang-orang dan kisah yang membuat Polowijen istimewa.",
	},
	{
		image: "/images/dashboard-kupatan.png",
		alt: "Warga membuat anyaman ketupat bersama",
		label: "Tradisi warga",
		title: "Belajar tradisi langsung dari sumbernya.",
		copy: "Ikuti kegiatan kampung dan bawa pulang pengalaman bermakna.",
	},
];

const shortcuts = [
	{ label: "Jelajah budaya", description: "Cerita dan tradisi", icon: Compass, href: "#komunitas", tone: "bg-[#e9efe3] text-[#315642]" },
	{ label: "UMKM lokal", description: "Karya warga", icon: ShoppingBag, href: "/user/umkm", tone: "bg-[#f5e7d4] text-[#a85a35]" },
	{ label: "Agenda", description: "Aktivitas kampung", icon: CalendarDays, href: "#agenda", tone: "bg-[#e8e7f0] text-[#5d527b]" },
	{ label: "Rating", description: "Bagikan kesanmu", icon: Star, tone: "bg-[#f6edcf] text-[#96721e]", action: "rating" },
];

const navigation = [
	{ label: "Beranda", href: "/user/dashboard" },
	{ label: "Cerita kampung", href: "#komunitas" },
	{ label: "Agenda", href: "#agenda" },
	{ label: "UMKM", href: "/user/umkm" },
];

export default function UserDashboardPage() {
	const carouselRef = useRef<HTMLDivElement>(null);
	const [activeSlide, setActiveSlide] = useState(0);
	const [menuOpen, setMenuOpen] = useState(false);
	const [ratingOpen, setRatingOpen] = useState(false);
	const [rating, setRating] = useState(0);
	const [submitted, setSubmitted] = useState(false);

	const moveToSlide = (index: number) => {
		const carousel = carouselRef.current;
		if (!carousel) return;
		const nextIndex = (index + slides.length) % slides.length;
		carousel.scrollTo({ left: carousel.clientWidth * nextIndex, behavior: "smooth" });
		setActiveSlide(nextIndex);
	};

	const handleCarouselScroll = () => {
		const carousel = carouselRef.current;
		if (carousel) setActiveSlide(Math.round(carousel.scrollLeft / carousel.clientWidth));
	};

	const closeMenu = () => setMenuOpen(false);

	return (
		<main className="min-h-screen overflow-x-hidden bg-[#f6f4ed] text-[#302d27]">
			<Head>
				<title>Beranda | Kampung Budaya Polowijen</title>
				<meta name="description" content="Jelajahi cerita, kegiatan, dan karya warga Kampung Budaya Polowijen." />
			</Head>

			<div className="mx-auto w-full max-w-[1240px] px-4 md:px-8">
				<header className="relative flex min-h-[76px] items-center justify-between border-b border-[#e5ded0] md:min-h-[92px]">
					<Link href="/user/dashboard" className="leading-tight" aria-label="Kampung Budaya Polowijen, beranda">
						<span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#9b3d32] md:text-[11px]">Kampung Budaya</span>
						<span className="mt-1 block text-[19px] font-extrabold md:text-[22px]">Polowijen</span>
					</Link>
					<nav className="hidden items-center gap-8 md:flex" aria-label="Navigasi utama">
						{navigation.map((item) => (
							<Link key={item.label} href={item.href} className="text-[13px] font-semibold text-[#5f584d] transition-colors hover:text-[#9b3d32]">{item.label}</Link>
						))}
					</nav>
					<button type="button" onClick={() => setMenuOpen((isOpen) => !isOpen)} aria-label={menuOpen ? "Tutup menu" : "Buka menu"} aria-expanded={menuOpen} className="flex h-10 w-10 items-center justify-center text-[#392b25] md:hidden">
						{menuOpen ? <X size={23} /> : <Menu size={23} />}
					</button>
				</header>

				{menuOpen && (
					<nav className="grid gap-1 border-b border-[#e5ded0] py-3 md:hidden" aria-label="Menu mobile">
						{navigation.map((item) => (
							<Link key={item.label} href={item.href} onClick={closeMenu} className="flex items-center justify-between py-3 text-sm font-semibold text-[#51473d]">
								{item.label}<ArrowRight size={16} className="text-[#9b3d32]" />
							</Link>
						))}
					</nav>
				)}

				<section aria-label="Cerita pilihan" className="relative mt-5 overflow-hidden rounded-[8px] bg-[#392a22] md:mt-8">
					<div ref={carouselRef} onScroll={handleCarouselScroll} className="flex h-[min(76vw,420px)] min-h-[300px] max-h-[500px] snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] md:h-[480px] [&::-webkit-scrollbar]:hidden" aria-roledescription="carousel">
						{slides.map((slide, index) => (
							<article key={slide.image} className="relative h-full min-w-full snap-start" role="group" aria-roledescription="slide" aria-label={`${index + 1} dari ${slides.length}`}>
								<Image src={slide.image} alt={slide.alt} fill priority={index === 0} sizes="(max-width: 768px) 100vw, 1176px" className="object-cover object-center" />
								<div className="absolute inset-0 bg-gradient-to-t from-[#211711]/90 via-[#211711]/35 to-[#211711]/5 md:bg-gradient-to-r md:from-[#211711]/85 md:via-[#211711]/35 md:to-transparent" />
								<div className="absolute inset-x-0 bottom-0 max-w-[680px] p-5 pb-12 text-white sm:p-8 sm:pb-14 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:p-12">
									<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1cf8c] md:text-xs">{slide.label}</p>
									<h1 className="mt-2 max-w-[570px] text-[29px] font-extrabold leading-[1.08] sm:text-[36px] md:text-[48px]">{slide.title}</h1>
									<p className="mt-3 max-w-[440px] text-[12px] leading-relaxed text-white/85 sm:text-sm md:mt-4 md:text-base">{slide.copy}</p>
									<Link href="#komunitas" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#f1cf8c] md:mt-6 md:text-sm">Kenali kampung <ArrowRight size={16} /></Link>
								</div>
							</article>
						))}
					</div>
					<div className="absolute inset-x-4 bottom-4 flex items-center justify-between md:inset-x-6 md:bottom-6">
						<div className="flex items-center gap-2" aria-label="Pilih slide">
							{slides.map((slide, index) => (
								<button key={slide.image} type="button" aria-label={`Tampilkan slide ${index + 1}`} aria-pressed={activeSlide === index} onClick={() => moveToSlide(index)} className={`h-2 rounded-full transition-all ${activeSlide === index ? "w-7 bg-[#f1cf8c]" : "w-2 bg-white/70"}`} />
							))}
						</div>
						<div className="hidden gap-2 md:flex">
							<button type="button" aria-label="Slide sebelumnya" onClick={() => moveToSlide(activeSlide - 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#392a22]"><ArrowLeft size={18} /></button>
							<button type="button" aria-label="Slide berikutnya" onClick={() => moveToSlide(activeSlide + 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#392a22]"><ArrowRight size={18} /></button>
						</div>
					</div>
				</section>

				<div className="mt-9 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
					<section aria-labelledby="shortcut-heading">
						<p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9b3d32]">Mulai dari sini</p>
						<div className="mt-1 flex items-end justify-between gap-3">
							<h2 id="shortcut-heading" className="text-[20px] font-extrabold md:text-[24px]">Jelajahi Polowijen</h2>
							<span className="hidden text-xs text-[#82766a] sm:block">Pilih pengalamanmu</span>
						</div>
						<div className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">
							{shortcuts.map(({ label, description, icon: Icon, href, tone, action }) => (
								<Link key={label} href={href ?? "#rating"} aria-haspopup={action === "rating" ? "dialog" : undefined} onClick={(event) => { if (action === "rating") { event.preventDefault(); setRatingOpen(true); setSubmitted(false); } }} className="group flex min-w-0 flex-col items-center text-center">
									<span className={`flex aspect-square w-full max-w-[88px] items-center justify-center rounded-[8px] transition-transform group-hover:-translate-y-1 ${tone}`}>
										<Icon size={24} strokeWidth={1.9} />
									</span>
									<span className="mt-2.5 text-[10px] font-bold leading-tight sm:text-xs">{label}</span>
									<span className="mt-1 text-[9px] leading-tight text-[#82766a] sm:text-[10px]">{description}</span>
								</Link>
							))}
						</div>
					</section>

					<section id="agenda" className="border-t border-[#e5ded0] pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
						<p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9b3d32]">Ruang pengalaman</p>
						<h2 className="mt-1 text-[20px] font-extrabold leading-tight md:text-[24px]">Budaya yang bisa kamu rasakan</h2>
						<p className="mt-2 max-w-[520px] text-[12px] leading-[1.7] text-[#71665b] md:text-sm">Ikuti kegiatan bersama warga, kenali kesenian tradisional, dan temukan karya lokal yang lahir dari kreativitas kampung.</p>
						<Link href="/user/umkm" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#9b3d32] md:text-sm">Lihat karya UMKM <ArrowRight size={16} /></Link>
					</section>
				</div>

				<section id="komunitas" className="mt-10 grid items-center gap-6 border-t border-[#e5ded0] py-8 md:grid-cols-[0.85fr_1.15fr] md:gap-12 md:py-12">
					<div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-[#e9e2d4] md:aspect-[4/3]">
						<Image src="/images/dashboard-kupatan.png" alt="Warga membuat anyaman ketupat bersama" fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover" />
					</div>
					<div className="max-w-[600px]">
						<p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9b3d32]">Cerita dari kampung</p>
						<h2 className="mt-2 text-[25px] font-extrabold leading-tight md:text-[34px]">Budaya yang terus hidup</h2>
						<p className="mt-3 text-[13px] leading-[1.8] text-[#71665b] md:text-[15px]">Di Polowijen, tradisi tumbuh dari kebersamaan warga. Gerak Tari Topeng Malangan, keterampilan para perajin, dan cerita yang diwariskan lintas generasi memberi makna pada setiap sudut kampung. Datanglah untuk mengenal budaya Malang dari dekat, bertemu warganya, dan merasakan suasana yang hangat.</p>
						<Link href="#agenda" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#315642] md:text-sm">Jelajahi kegiatan <ChevronDown size={16} /></Link>
					</div>
				</section>

				<footer id="profil" className="flex flex-col gap-2 border-t border-[#e5ded0] py-6 text-[10px] text-[#82766a] sm:flex-row sm:items-center sm:justify-between">
					<p className="font-bold text-[#9b3d32]">Kampung Budaya Polowijen</p>
					<p>Merawat tradisi, menyambut cerita baru.</p>
				</footer>
			</div>

			{ratingOpen && (
				<div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#211711]/65 p-4" onClick={() => setRatingOpen(false)}>
					<section role="dialog" aria-modal="true" aria-labelledby="rating-heading" onClick={(event) => event.stopPropagation()} className="w-full max-w-[420px] rounded-[8px] bg-[#fbf7ee] p-5 shadow-2xl sm:p-7">
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9b3d32]">Masukan pengunjung</p>
								<h2 id="rating-heading" className="mt-1 text-xl font-extrabold">Bagaimana pengalamanmu?</h2>
							</div>
							<button type="button" aria-label="Tutup rating" onClick={() => setRatingOpen(false)} className="flex h-9 w-9 shrink-0 items-center justify-center text-[#51473d]"><X size={20} /></button>
						</div>
						<p className="mt-2 text-sm leading-relaxed text-[#71665b]">Bagikan penilaianmu untuk membantu kami merawat pengalaman di Kampung Budaya Polowijen.</p>
						<div className="mt-5 flex items-center gap-2" aria-label="Pilih rating">
							{[1, 2, 3, 4, 5].map((ratingValue) => (
								<button key={ratingValue} type="button" aria-label={`${ratingValue} dari 5 bintang`} aria-pressed={rating === ratingValue} onClick={() => { setRating(ratingValue); setSubmitted(false); }} className="p-1 text-[#c49a4a]">
									<Star size={28} fill={ratingValue <= rating ? "currentColor" : "none"} strokeWidth={1.8} />
								</button>
							))}
						</div>
						<button type="button" disabled={rating === 0} onClick={() => setSubmitted(true)} className="mt-5 w-full rounded-[6px] bg-[#9b3d32] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45">Kirim rating</button>
						{submitted && <p role="status" className="mt-3 text-sm font-semibold text-[#315642]">Terima kasih atas penilaianmu.</p>}
					</section>
				</div>
			)}
		</main>
	);
}
