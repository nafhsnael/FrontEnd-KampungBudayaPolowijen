import { Pencil, Plus, Search, Store, Trash2 } from "lucide-react";

export type Business = {
  id: number;
  name: string;
  category: string;
  description: string;
};

export function UmkmHeroSection() {
  return (
    <section className="page-heading">
      <div>
        <h1>Kelola UMKM</h1>
        <p className="page-description">
          Daftar usaha dan produk lokal yang tumbuh bersama komunitas.
        </p>
      </div>
    </section>
  );
}

export function UmkmOverviewSection({
  businessCount,
  categoryCount,
  onAdd,
}: {
  businessCount: number;
  categoryCount: number;
  onAdd: () => void;
}) {
  return (
    <section className="overview-strip" aria-label="Ringkasan UMKM">
      <div className="overview-stat">
        <span>UMKM terdaftar</span>
        <strong>{String(businessCount).padStart(2, "0")}</strong>
      </div>
      <div className="overview-divider" />
      <div className="overview-stat category-stat">
        <span>Kategori usaha</span>
        <strong>{String(categoryCount).padStart(2, "0")}</strong>
      </div>
      <p className="overview-note">
        Mengangkat kriya, kuliner, dan minuman khas Polowijen.
      </p>
      <button type="button" className="add-business-button" onClick={onAdd}>
        <Plus size={17} strokeWidth={2.2} aria-hidden="true" />
        <span>Tambah UMKM Baru</span>
      </button>
    </section>
  );
}

export function UmkmDirectorySection({
  businesses,
  totalCount,
  search,
  onSearchChange,
  onEdit,
  onDelete,
  getCategoryClass,
}: {
  businesses: Business[];
  totalCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  onEdit: (business: Business) => void;
  onDelete: (business: Business) => void;
  getCategoryClass: (category: string) => string;
}) {
  return (
    <section className="directory-section" aria-labelledby="directory-heading">
      <div className="directory-heading">
        <div>
          <p className="section-kicker">DIREKTORI USAHA</p>
          <h2 id="directory-heading">Daftar UMKM</h2>
        </div>
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Cari UMKM</span>
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari nama atau kategori"
          />
        </label>
      </div>

      <div
        className="business-table"
        role="table"
        aria-label="Daftar UMKM Kampung Budaya Polowijen"
      >
        <div className="table-header" role="row">
          <span role="columnheader">No.</span>
          <span role="columnheader">Nama UMKM</span>
          <span role="columnheader">Jenis usaha</span>
          <span role="columnheader">Aksi</span>
        </div>
        {businesses.map((business, index) => (
          <div className="business-row" role="row" key={business.id}>
            <span className="row-number" role="cell">{String(index + 1).padStart(2, "0")}</span>
            <div className="business-name-cell" role="cell">
              <span className="business-mark">
                <Store size={17} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="business-copy">
                <strong>{business.name}</strong>
                <small>{business.description}</small>
              </span>
            </div>
            <span className={`category-pill ${getCategoryClass(business.category)}`} role="cell">
              {business.category}
            </span>
            <div className="row-actions" role="cell">
              <button
                type="button"
                className="row-action edit-action"
                onClick={() => onEdit(business)}
                aria-label={`Edit ${business.name}`}
                title="Edit"
              >
                <Pencil size={14} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="row-action delete-action"
                onClick={() => onDelete(business)}
                aria-label={`Hapus ${business.name}`}
                title="Hapus"
              >
                <Trash2 size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
        {businesses.length === 0 && (
          <p className="empty-state">Tidak ada UMKM yang cocok dengan pencarian.</p>
        )}
      </div>
      <p className="list-count">
        Menampilkan <strong>{businesses.length}</strong> dari{" "}
        <strong>{totalCount}</strong> UMKM
      </p>
    </section>
  );
}
