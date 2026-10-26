import Image from "next/image";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";

type ViewMode = "home" | "grid" | "detail";

type CatalogHeaderSectionProps = {
  viewMode: Exclude<ViewMode, "detail">;
  category: string;
  search: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
  onShowAll: () => void;
  onShowHome: () => void;
};

const categories = ["Semua", "Makanan", "Kerajinan", "Fashion"];

export default function CatalogHeaderSection({
  viewMode,
  category,
  search,
  onCategoryChange,
  onSearchChange,
  onShowAll,
  onShowHome,
}: CatalogHeaderSectionProps) {
  return (
    <section className="px-5 pt-8">
      <header className="flex items-center gap-3">
        <Image
          src="/images/logo2.png"
          alt="Logo Kampung Budaya Polowijen"
          width={48}
          height={48}
          className="h-12 w-12 object-contain"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9B3D32]">
            Kampung Budaya
          </p>
          <h1 className="text-xl font-bold">Dukung UMKM Lokal</h1>
        </div>
      </header>

      {viewMode === "home" && (
        <p className="mt-4 max-w-sm text-sm leading-5 text-[#6d554a]">
          Jelajahi produk unggulan dari pelaku UMKM Kampung Budaya Polowijen.
        </p>
      )}

      <label className="mt-5 flex items-center gap-2 rounded-full border border-[#ead7b8] bg-white px-4 py-3">
        <Search size={17} className="text-[#9B3D32]" aria-hidden="true" />
        <span className="sr-only">Cari produk UMKM</span>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari produk UMKM..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </label>

      {viewMode === "home" ? (
        <>
          <nav aria-label="Kategori produk" className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onCategoryChange(item)}
                aria-pressed={category === item}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold ${category === item ? "bg-[#9B3D32] text-white" : "bg-[#f1e5d1] text-[#4A2920]"}`}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="mt-5 flex items-center justify-between">
            <h2 className="text-lg font-bold">Produk unggulan</h2>
            <button type="button" onClick={onShowAll} aria-label="Lihat semua produk">
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={onShowHome}
          className="mt-5 flex items-center gap-1 text-sm font-semibold"
        >
          <ArrowLeft size={17} /> Kembali
        </button>
      )}
    </section>
  );
}
