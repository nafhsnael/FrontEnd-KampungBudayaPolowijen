import Head from "next/head";
import { useState, type FormEvent } from "react";
import { Pencil, Plus, Search, Store, Trash2, X } from "lucide-react";
import AdminSidebar from "../../components/layout/AdminSidebar";

type Business = {
  id: number;
  name: string;
  category: string;
  description: string;
};

const INITIAL_BUSINESSES: Business[] = [
  { id: 1, name: "Kriya Topeng Malang", category: "Kriya", description: "Pembuatan kerajinan Topeng Malangan." },
  { id: 2, name: "Kriya Batik Malang", category: "Kriya", description: "Produksi batik khas KBP." },
  { id: 3, name: "Kerajinan KBP", category: "Kriya", description: "Berbagai kerajinan kreatif." },
  { id: 4, name: "Sego Berkat", category: "Kuliner", description: "Makanan tradisional." },
  { id: 5, name: "Tumpeng", category: "Kuliner", description: "Produk kuliner dan tradisional." },
  { id: 6, name: "Dawet", category: "Minuman", description: "Minuman tradisional." },
  { id: 7, name: "Wedang", category: "Minuman", description: "Minuman tradisional." },
];

const BUILT_IN_CATEGORIES = ["Kriya", "Kuliner", "Minuman"];
const EMPTY_FORM = { name: "", category: "Kriya", customCategory: "", description: "" };

function categoryClass(category: string) {
  return BUILT_IN_CATEGORIES.includes(category) ? category.toLowerCase() : "custom";
}

export default function AdminUMKMPage() {
  const [businesses, setBusinesses] = useState(INITIAL_BUSINESSES);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Business | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filteredBusinesses = businesses.filter((business) =>
    `${business.name} ${business.category} ${business.description}`.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const categoryCount = new Set(businesses.map((business) => business.category)).size;

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEditForm(business: Business) {
    setEditingId(business.id);
    const isBuiltInCategory = BUILT_IN_CATEGORIES.includes(business.category);
    setForm({
      name: business.name,
      category: isBuiltInCategory ? business.category : "Lainnya",
      customCategory: isBuiltInCategory ? "" : business.category,
      description: business.description,
    });
    setFormOpen(true);
  }

  function saveBusiness(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const category = form.category === "Lainnya" ? form.customCategory.trim() : form.category;
    const savedBusiness = { name: form.name.trim(), category, description: form.description.trim() };
    if (!savedBusiness.name || !savedBusiness.category) return;

    if (editingId !== null) {
      setBusinesses((current) => current.map((business) => business.id === editingId ? { ...business, ...savedBusiness } : business));
    } else {
      setBusinesses((current) => [...current, { id: Date.now(), ...savedBusiness }]);
    }
    setFormOpen(false);
  }

  function deleteBusiness() {
    if (!deleteTarget) return;
    setBusinesses((current) => current.filter((business) => business.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <>
      <Head>
        <title>Kelola UMKM | Kampung Budaya Polowijen</title>
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="umkm-shell">
        <AdminSidebar activeRoute="umkm" />

        <main className="umkm-main">
          <div className="page-heading">
            <div>
              <h1>Kelola UMKM</h1>
              <p className="page-description">Daftar usaha dan produk lokal yang tumbuh bersama komunitas.</p>
            </div>
          </div>

          <section className="overview-strip" aria-label="Ringkasan UMKM">
            <div className="overview-stat">
              <span>UMKM terdaftar</span>
              <strong>{String(businesses.length).padStart(2, "0")}</strong>
            </div>
            <div className="overview-divider" />
            <div className="overview-stat category-stat">
              <span>Kategori usaha</span>
              <strong>{String(categoryCount).padStart(2, "0")}</strong>
            </div>
            <p className="overview-note">Mengangkat kriya, kuliner, dan minuman khas Polowijen.</p>
            <button type="button" className="add-business-button" onClick={openCreateForm}>
              <Plus size={17} strokeWidth={2.2} aria-hidden="true" />
              <span>Tambah UMKM Baru</span>
            </button>
          </section>

          <section className="directory-section" aria-labelledby="directory-heading">
            <div className="directory-heading">
              <div>
                <p className="section-kicker">DIREKTORI USAHA</p>
                <h2 id="directory-heading">Daftar UMKM</h2>
              </div>
              <label className="search-field">
                <Search size={17} aria-hidden="true" />
                <span className="sr-only">Cari UMKM</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama atau kategori" />
              </label>
            </div>

            <div className="business-table" role="table" aria-label="Daftar UMKM Kampung Budaya Polowijen">
              <div className="table-header" role="row">
                <span role="columnheader">No.</span>
                <span role="columnheader">Nama UMKM</span>
                <span role="columnheader">Jenis usaha</span>
                <span role="columnheader">Aksi</span>
              </div>
              {filteredBusinesses.map((business, index) => (
                <div className="business-row" role="row" key={business.id}>
                  <span className="row-number" role="cell">{String(index + 1).padStart(2, "0")}</span>
                  <div className="business-name-cell" role="cell">
                    <span className="business-mark"><Store size={17} strokeWidth={1.8} aria-hidden="true" /></span>
                    <span className="business-copy"><strong>{business.name}</strong><small>{business.description}</small></span>
                  </div>
                  <span className={`category-pill ${categoryClass(business.category)}`} role="cell">{business.category}</span>
                  <div className="row-actions" role="cell">
                    <button type="button" className="row-action edit-action" onClick={() => openEditForm(business)} aria-label={`Edit ${business.name}`} title="Edit">
                      <Pencil size={14} aria-hidden="true" />
                    </button>
                    <button type="button" className="row-action delete-action" onClick={() => setDeleteTarget(business)} aria-label={`Hapus ${business.name}`} title="Hapus">
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredBusinesses.length === 0 && <p className="empty-state">Tidak ada UMKM yang cocok dengan pencarian.</p>}
            </div>
            <p className="list-count">Menampilkan <strong>{filteredBusinesses.length}</strong> dari <strong>{businesses.length}</strong> UMKM</p>
          </section>
        </main>
      </div>

      {formOpen && (
        <div className="umkm-overlay" onMouseDown={(event) => event.target === event.currentTarget && setFormOpen(false)}>
          <form className="umkm-dialog" role="dialog" aria-modal="true" aria-labelledby="umkm-dialog-title" onSubmit={saveBusiness}>
            <div className="dialog-heading">
              <div><p className="section-kicker">DIREKTORI USAHA</p><h2 id="umkm-dialog-title">{editingId === null ? "Tambah UMKM" : "Edit UMKM"}</h2></div>
              <button type="button" className="close-dialog" onClick={() => setFormOpen(false)} aria-label="Tutup"><X size={19} /></button>
            </div>
            <label>Nama UMKM<input required autoFocus value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label>Jenis usaha<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Kriya</option><option>Kuliner</option><option>Minuman</option><option>Lainnya</option></select></label>
            {form.category === "Lainnya" && <label>Kategori lainnya<input required value={form.customCategory} onChange={(event) => setForm({ ...form, customCategory: event.target.value })} placeholder="Tulis kategori usaha" /></label>}
            <label>Deskripsi<textarea required rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
            <button type="submit" className="save-business-button">{editingId === null ? "Simpan UMKM" : "Simpan perubahan"}</button>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="umkm-overlay" onMouseDown={(event) => event.target === event.currentTarget && setDeleteTarget(null)}>
          <div className="umkm-dialog delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title">
            <p className="section-kicker">KONFIRMASI</p>
            <h2 id="delete-dialog-title">Hapus UMKM?</h2>
            <p>“{deleteTarget.name}” akan dihapus dari daftar UMKM.</p>
            <div className="dialog-actions">
              <button type="button" className="cancel-button" onClick={() => setDeleteTarget(null)}>Batal</button>
              <button type="button" className="confirm-delete-button" onClick={deleteBusiness}>Hapus UMKM</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        :root { --umkm-brown:#4a2a1f; --umkm-cream:#fff8ec; --umkm-ink:#241a16; --umkm-muted:#75645b; --umkm-line:#e9dfd2; --umkm-green:#147a66; }
        *,*::before,*::after { box-sizing:border-box; }
        body { margin:0; background:#faf7f1; color:var(--umkm-ink); font:400 14px/1.55 Poppins,sans-serif; }
        .sr-only { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; }
      `}</style>
      <style jsx>{`
        .umkm-shell { min-height:100vh; display:flex; }
        .umkm-main { width:min(100% - 234px,1440px); min-width:0; margin:0 auto; padding:42px clamp(24px,4vw,64px) 56px; }
        .page-heading { display:flex; align-items:flex-end; justify-content:space-between; gap:20px; margin-bottom:26px; }
        .section-kicker { margin:0 0 8px; color:#917761; font-size:10px; font-weight:600; letter-spacing:.12em; }
        .page-heading h1 { margin:0; color:var(--umkm-brown); font-size:24px; line-height:1.25; font-weight:700; }
        .page-description { margin:7px 0 0; color:var(--umkm-muted); font-size:13px; }
        .overview-strip { min-height:122px; display:flex; align-items:center; gap:27px; padding:20px 24px; border:1px solid #e7ddd0; border-radius:12px; background:#fff; box-shadow:0 4px 18px rgba(56,38,26,.06); }
        .overview-stat { min-width:126px; display:flex; flex-direction:column; gap:2px; }
        .overview-stat > span { color:var(--umkm-muted); font-size:11px; }
        .overview-stat strong { color:var(--umkm-brown); font-size:30px; line-height:1.15; font-weight:600; }
        .overview-divider { width:1px; height:54px; background:var(--umkm-line); }
        .category-stat { min-width:100px; }
        .overview-note { max-width:220px; margin:0 auto 0 0; color:var(--umkm-muted); font-size:12px; line-height:1.6; }
        .add-business-button { min-height:42px; display:inline-flex; flex:0 0 auto; align-items:center; justify-content:center; gap:9px; padding:0 15px; border:0; border-radius:7px; background:var(--umkm-brown); color:#fff8ec; font:500 12px Poppins,sans-serif; cursor:pointer; transition:background .2s,transform .2s; }
        .add-business-button:hover { transform:translateY(-1px); background:#63402e; }
        .directory-section { margin-top:30px; }
        .directory-heading { display:flex; align-items:flex-end; justify-content:space-between; gap:18px; margin-bottom:13px; }
        .directory-heading .section-kicker { margin-bottom:4px; }
        .directory-heading h2 { margin:0; color:var(--umkm-brown); font-size:20px; line-height:1.3; font-weight:600; }
        .search-field { width:min(280px,45%); min-height:39px; display:flex; align-items:center; gap:9px; padding:0 11px; border:1px solid #dfd3c5; border-radius:7px; background:#fff; color:#8a786d; }
        .search-field input { width:100%; min-width:0; border:0; outline:0; background:transparent; color:var(--umkm-ink); font:400 11px Poppins,sans-serif; }
        .search-field input::placeholder { color:#9d8f84; }
        .business-table { overflow:hidden; border:1px solid #e7ddd0; border-radius:11px; background:#fff; box-shadow:0 5px 20px rgba(56,38,26,.055); }
        .table-header,.business-row { display:grid; grid-template-columns:46px minmax(220px,1.45fr) minmax(120px,.8fr) 108px; align-items:center; column-gap:14px; }
        .table-header { min-height:43px; padding:0 18px; border-bottom:1px solid var(--umkm-line); background:#fcfaf6; color:#8d7d72; font-size:10px; font-weight:600; }
        .business-row { min-height:68px; padding:9px 18px; border-bottom:1px solid #f0e9e0; transition:background .16s; }
        .business-row:last-of-type { border-bottom:0; }
        .business-row:hover { background:#fffdf9; }
        .row-number { color:#a18f81; font-size:10px; font-variant-numeric:tabular-nums; }
        .business-name-cell { min-width:0; display:flex; align-items:center; gap:11px; }
        .business-mark { width:34px; height:34px; flex:0 0 34px; display:grid; place-items:center; border-radius:9px; background:#f5ede2; color:#775036; }
        .business-copy { min-width:0; display:flex; flex-direction:column; gap:2px; }
        .business-copy strong { overflow:hidden; color:#37251c; font-size:12px; line-height:1.4; font-weight:600; text-overflow:ellipsis; white-space:nowrap; }
        .business-copy small { overflow:hidden; color:#84766c; font-size:10px; line-height:1.4; text-overflow:ellipsis; white-space:nowrap; }
        .category-pill { width:fit-content; padding:4px 9px; border-radius:20px; font-size:10px; }
        .category-pill.kriya { background:#eadccd; color:#68472f; }
        .category-pill.kuliner { background:#f8eee1; color:#9b5d24; }
        .category-pill.minuman { background:#e7f2ee; color:#276c5c; }
        .category-pill.custom { background:#e3effa; color:#336b9b; }
        .row-actions { display:flex; justify-content:flex-end; gap:6px; }
        .row-action { width:31px; height:31px; display:grid; place-items:center; padding:0; border:1px solid transparent; border-radius:7px; cursor:pointer; transition:background .16s,transform .16s; }
        .row-action:hover { transform:translateY(-1px); }
        .edit-action { background:#e4f2ed; color:#17806a; }
        .edit-action:hover { background:#cde9df; }
        .delete-action { background:#f9e9e5; color:#bd5148; }
        .delete-action:hover { background:#f2d7d1; }
        .empty-state { margin:0; padding:35px 20px; color:var(--umkm-muted); text-align:center; font-size:12px; }
        .list-count { margin:10px 2px 0; color:#89796d; font-size:10px; }
        .list-count strong { color:var(--umkm-brown); }
        .umkm-overlay { position:fixed; inset:0; z-index:40; display:grid; place-items:center; overflow-y:auto; padding:20px; background:rgba(34,23,17,.52); animation:umkm-fade .18s ease both; }
        @keyframes umkm-fade { from { opacity:0; } to { opacity:1; } }
        .umkm-dialog { width:min(460px,100%); padding:25px; border:1px solid #ede3d7; border-radius:12px; background:#fffaf3; box-shadow:0 20px 60px rgba(0,0,0,.2); }
        .dialog-heading { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:20px; }
        .dialog-heading .section-kicker { margin-bottom:4px; }
        .dialog-heading h2,.delete-dialog h2 { margin:0; color:var(--umkm-brown); font-size:20px; font-weight:600; }
        .close-dialog { width:32px; height:32px; display:grid; place-items:center; border:0; border-radius:7px; background:transparent; color:var(--umkm-brown); cursor:pointer; }
        .close-dialog:hover { background:#f2e8dc; }
        .umkm-dialog > label { display:block; margin-top:13px; color:#614636; font-size:11px; font-weight:500; }
        .umkm-dialog input,.umkm-dialog select,.umkm-dialog textarea { width:100%; margin-top:5px; padding:10px; border:1px solid #ded1c1; border-radius:6px; background:#fff; color:var(--umkm-ink); font:400 12px Poppins,sans-serif; }
        .umkm-dialog textarea { resize:vertical; }
        .umkm-dialog input:focus,.umkm-dialog select:focus,.umkm-dialog textarea:focus { outline:2px solid #b7834d; outline-offset:1px; }
        .save-business-button { width:100%; min-height:42px; margin-top:20px; border:0; border-radius:7px; background:var(--umkm-brown); color:#fff8ec; font:500 12px Poppins,sans-serif; cursor:pointer; }
        .delete-dialog > p:not(.section-kicker) { margin:11px 0 20px; color:var(--umkm-muted); font-size:13px; }
        .dialog-actions { display:flex; justify-content:flex-end; gap:9px; }
        .dialog-actions button { min-height:38px; padding:0 13px; border-radius:6px; font:500 11px Poppins,sans-serif; cursor:pointer; }
        .cancel-button { border:1px solid #d8cbbd; background:transparent; color:#684d3b; }
        .confirm-delete-button { border:1px solid #b64c42; background:#b64c42; color:white; }
        @media (max-width:900px) {
          .umkm-main { width:calc(100% - 205px); padding:34px 24px 46px; }
          .overview-strip { gap:17px; padding:18px; }
          .overview-stat { min-width:100px; }
          .overview-note { font-size:11px; }
          .table-header,.business-row { grid-template-columns:36px minmax(0,1.4fr) minmax(90px,.75fr) 76px; gap:10px; padding-right:13px; padding-left:13px; }
          .row-action { width:29px; height:29px; }
        }
        @media (max-width:680px) {
          .umkm-main { width:calc(100% - 205px); padding:28px 17px 40px; }
          .page-heading h1 { font-size:24px; }
          .page-description { font-size:11px; }
          .overview-strip { min-height:unset; flex-wrap:wrap; gap:12px; padding:14px; }
          .overview-stat { min-width:70px; }
          .overview-stat strong { font-size:24px; }
          .overview-divider { height:42px; }
          .overview-note { display:none; }
          .add-business-button { min-height:38px; margin-left:auto; padding:0 10px; font-size:10px; }
          .directory-heading { align-items:flex-start; flex-direction:column; gap:11px; }
          .search-field { width:100%; }
          .table-header,.business-row { grid-template-columns:26px minmax(0,1fr) 74px 68px; gap:7px; padding-right:9px; padding-left:9px; }
          .table-header { font-size:9px; }
          .business-row { min-height:64px; }
          .business-mark { width:28px; height:28px; flex-basis:28px; }
          .business-mark :global(svg) { width:15px; }
          .business-name-cell { gap:7px; }
          .business-copy strong { font-size:10px; }
          .business-copy small { font-size:9px; }
          .category-pill { padding:4px 6px; font-size:9px; }
          .row-actions { gap:3px; }
          .row-action { width:27px; height:27px; }
        }
        @media (max-width:650px) {
          .umkm-shell { display:block; }
          .umkm-main { width:100%; padding:24px 16px 38px; }
        }
        @media (max-width:520px) {
          .overview-strip { gap:12px; }
          .add-business-button { width:100%; margin:3px 0 0; }
        }
        @media (max-width:390px) {
          .umkm-main { padding-right:12px; padding-left:12px; }
          .table-header,.business-row { grid-template-columns:23px minmax(0,1fr) 65px 62px; gap:5px; padding-right:7px; padding-left:7px; }
          .business-copy strong { white-space:normal; }
          .row-action { width:25px; height:25px; }
          .category-pill { font-size:8px; }
        }
        @media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation-duration:.01ms !important; transition-duration:.01ms !important; } }
      `}</style>
    </>
  );
}
