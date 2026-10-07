// src/pages/admin/paket.tsx
import Head from "next/head";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2, X as IkonX } from "lucide-react";
import AdminSidebar from "../../components/layout/AdminSidebar";

type Paket = { id: number; nama: string; harga: string; gambar: string; isi: string[]; tambah: string[] };
type Tab = "paket" | "jadwal";
type Jadwal = { id: number; hari: string; nama: string; jam: string; gambar: string; desc: string };
const JF_KOSONG = { nama: "", hari: "", jam: "", desc: "", gambar: "" };

const PAKET_AWAL: Paket[] = [
  { id: 1, nama: "Sambang Kampung", harga: "Rp 1 juta / 30 orang", gambar: "/images/paket/sambang-kampung.jpeg",
    isi: ["Selebihnya Rp 30 rb/orang", "Sinau budaya adat dan tradisi", "Sajian tari tradisi/topeng", "Bebas dokumentasi", "Demo membatik/topeng", "Kudapan jajanan lawas", "Omben-omben jamu/dawet"],
    tambah: ["Tambah makan sego berkat 20 rb/orang", "Tambah edukasi cek di paket Hasta Karya"] },
  { id: 2, nama: "Sobo Pasar", harga: "Rp 30 rb / orang", gambar: "/images/paket/tarian1.jpeg",
    isi: ["Sedia busana tradisional", "Bebas dokumentasi", "Masak Cethik Geni Pawon", "Membatik/mewarnai kerajinan", "Medayoh ke omah warga", "Omben-omben kopi/rempah"],
    tambah: ["Tambah makan sego berkat 20 rb/orang", "Tambah edukasi cek di paket Hasta Karya"] },
  { id: 3, nama: "Medayoh", harga: "Rp 30 rb / orang", gambar: "/images/paket/tarian.jpeg",
    isi: ["Khusus Sabtu (13.00-17.00)", "Kelompok 3-10 org", "Sinau budaya & wawancara", "Bebas dokumentasi", "Sajian gladhi tari Topeng", "Omben-omben dan jajanan lawas"],
    tambah: ["Tambah makan sego berkat 20 rb/orang", "Tambah edukasi cek di paket Hasta Karya"] },
  { id: 4, nama: "Selametan / Metri", harga: "Rp 1 juta / 20 orang", gambar: "/images/paket/kupatan.jpeg",
    isi: ["Cocok untuk metri weton (ulang tahun kelahiran, pernikahan)", "Memakai busana adat", "Sego tumpeng/sego berkat", "Jenang sengkolo", "Jajanan lawas, wedangan, ngopi", "Bisa dekorasi, bebas dokumentasi"], tambah: [] },
  { id: 5, nama: "Hasta Karya", harga: "Mulai Rp 25 rb / orang", gambar: "/images/paket/lukis-topeng.jpeg",
    isi: ["Membatik topeng 100 rb/orang", "Membatik/ecoprint 50 rb/orang", "Melukis topeng 35 rb/orang", "Melukis jaranan 25 rb/orang", "Melukis anyaman bambu 25 rb/orang", "Melukis wayang 25 rb/orang"], tambah: [] },
];
const JADWAL_AWAL: Jadwal[] = [
  { id: 1,  hari: "Jumat", nama: "Sarasehan Budaya Malang", jam: "19.00-21.00", gambar: "/images/paket/sambang-kampung.jpeg", desc: "Sarasehan budaya yang membahas Macapat, Topeng, dan Wayang." },
  { id: 2, hari: "Sabtu", nama: "Bantengan / Jaranan", jam: "09.00-13.00", gambar: "/images/paket/tarian1.jpeg", desc: "Sesi Bantengan dan Jaranan setiap Sabtu pagi." },
  { id: 3, hari: "Sabtu", nama: "Gladhi Tari Tradisi", jam: "13.00-15.00", gambar: "/images/paket/tarian.jpeg", desc: "Gladhi atau latihan tari tradisi bersama." },
  { id: 4, hari: "Sabtu", nama: "Hasta Karya / Liwetan", jam: "13.00-15.00", gambar: "/images/paket/lukis-topeng.jpeg", desc: "Kegiatan hasta karya dan liwetan bersama." },
  { id: 5, hari: "Sabtu", nama: "Gladhi Tari Topeng", jam: "15.00-17.00", gambar: "/images/paket/tarian.jpeg", desc: "Gladhi atau latihan tari Topeng Malang." },
  { id: 6, hari: "Sabtu", nama: "Sinau Budaya", jam: "15.00-17.00", gambar: "/images/paket/kupatan.jpeg", desc: "Sinau budaya, adat, dan tradisi Kampung Budaya Polowijen." },
];
const BAYAR = ["BCA", "Mandiri", "BRI", "GoPay", "OVO", "DANA", "QRIS", "Bayar di lokasi"];

// Ukuran kartu per jarak dari tengah: [tengah, sebelahnya, paling pinggir]
const W = [310, 260, 210];   // lebar (px)
const H = [600, 500, 400];   // tinggi (px)
const X = [0, 301, 552];     // geser horizontal dari tengah (px)
const OP = [1, 0.92, 0.75];  // opacity
const STAGE_H = 640;
const LEBAR_5 = 1050;        // lebar area carousel minimum untuk 5 kartu (di bawah 1314px kartu dirapatkan otomatis)
const LEBAR_PENUH = 1314;    // lebar yang dibutuhkan 5 kartu pada ukuran normal
const LEBAR_3 = 860;         // minimum untuk 3 kartu (di bawahnya 1 kartu)

export default function PaketAdmin() {
  const [tab, setTab] = useState<Tab>("paket");
  const [idx, setIdx] = useState(2);
  const [pilih, setPilih] = useState<Paket | null>(null);
  const [selesai, setSelesai] = useState(false);
  const [metode, setMetode] = useState("");
  const [f, setF] = useState({ nama: "", hp: "", tgl: "", jumlah: "" });
  const [pakets, setPakets] = useState<Paket[]>(PAKET_AWAL);
  const [editing, setEditing] = useState<Paket | null>(null);
  const [pf, setPf] = useState({ nama: "", harga: "", gambar: "", isi: "", tambah: "" });
  const [errGambar, setErrGambar] = useState("");
  const [jadwals, setJadwals] = useState<Jadwal[]>(JADWAL_AWAL);
const [jEdit, setJEdit] = useState<Jadwal | "baru" | null>(null);
const [jf, setJf] = useState(JF_KOSONG);
const [jHapus, setJHapus] = useState<Jadwal | null>(null);
const [errJ, setErrJ] = useState("");
  const sx = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [sw, setSw] = useState(1400);   // lebar area carousel
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSw(el.clientWidth));
    ro.observe(el);
    setSw(el.clientWidth);
    return () => ro.disconnect();
  }, [tab]);
  const maxA = sw >= LEBAR_5 ? 2 : sw >= LEBAR_3 ? 1 : 0;           // jarak terjauh yang ditampilkan
  const sc = maxA === 2 ? Math.min(1, sw / LEBAR_PENUH) : 1;          // kecilkan lebar & jarak kartu kalau area kurang lebar
  const k = Math.min(1.15, Math.max(1, (sw / 2 - 115) / X[2]));      // renggangkan jarak kalau layar lebar
  const n = pakets.length;
  const geser = (d: number) => setIdx((i) => (i + d + n) % n);
  const siap = f.nama.trim() && f.hp.trim() && f.tgl && +f.jumlah > 0 && metode;
  const pindahTab = (t: Tab) => { setTab(t); setPilih(null); setSelesai(false); };
  const tutupPesan = () => { setPilih(null); setSelesai(false); };

  const bukaEdit = (p: Paket) => {
    setEditing(p);
    setPf({ nama: p.nama, harga: p.harga, gambar: p.gambar, isi: p.isi.join("\n"), tambah: p.tambah.join("\n") });
    setErrGambar("");
  };
  const unggah = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setErrGambar("Pilih file gambar yang valid."); return; }
    setErrGambar("");
    setPf((c) => ({ ...c, gambar: URL.createObjectURL(file) }));
  };
  const baris = (t: string) => t.split("\n").map((x) => x.trim()).filter(Boolean);
  const simpan = (e: FormEvent) => {
    e.preventDefault();
    if (!editing || !pf.nama.trim() || !pf.harga.trim()) return;
    const data: Paket = { id: editing.id, nama: pf.nama.trim(), harga: pf.harga.trim(), gambar: pf.gambar, isi: baris(pf.isi), tambah: baris(pf.tambah) };
    setPakets((l) => l.map((p) => (p.id === data.id ? data : p)));
    setEditing(null);
  };

  const bukaTambahJ = () => { setJf(JF_KOSONG); setErrJ(""); setJEdit("baru"); };
const bukaEditJ = (j: Jadwal) => {
  setJf({ nama: j.nama, hari: j.hari, jam: j.jam, desc: j.desc, gambar: j.gambar });
  setErrJ("");
  setJEdit(j);
};
const unggahJ = (file?: File) => {
  if (!file) return;
  if (!file.type.startsWith("image/")) { setErrJ("Pilih file gambar yang valid."); return; }
  setErrJ("");
  setJf((c) => ({ ...c, gambar: URL.createObjectURL(file) }));
};
const simpanJ = (e: FormEvent) => {
  e.preventDefault();
  if (!jEdit || !jf.nama.trim() || !jf.hari) return;
  const data = { nama: jf.nama.trim(), hari: jf.hari, jam: jf.jam.trim(), desc: jf.desc.trim(), gambar: jf.gambar };
  if (jEdit === "baru") {
    setJadwals((l) => [...l, { id: Date.now(), ...data }]);
  } else {
    const id = jEdit.id;
    setJadwals((l) => l.map((j) => (j.id === id ? { id, ...data } : j)));
  }
  setJEdit(null);
};
const hapusJ = () => {
  if (!jHapus) return;
  const id = jHapus.id;
  setJadwals((l) => l.filter((j) => j.id !== id));
  setJHapus(null);
};

  const swipeEnd = (x: number) => {
    if (sx.current === null) return;
    const d = x - sx.current;
    sx.current = null;
    if (Math.abs(d) > 40) geser(d < 0 ? 1 : -1);
  };

  return (
    <>
      <Head>
        <title>Paket Kunjungan | Kampung Budaya Polowijen</title>
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="event-app">
        <AdminSidebar activeRoute="paket" />

        <main className="event-main">
          <div className="tabs" role="tablist">
            {([["paket", "Paket Kunjungan"], ["jadwal", "Jadwal Rutin"]] as [Tab, string][]).map(([t, l]) => (
              <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => pindahTab(t)}>{l}</button>
            ))}
          </div>

          <div className="view" key={tab}>
            {tab === "paket" && (
              <div className="car">
                <button className="arr" aria-label="Sebelumnya" onClick={() => geser(-1)}>‹</button>
                <div
                  className="stage"
                  ref={stageRef}
                  onTouchStart={(e) => { sx.current = e.touches[0].clientX; }}
                  onTouchEnd={(e) => swipeEnd(e.changedTouches[0].clientX)}
                >
                  {pakets.map((p, i) => {
                    let o = (((i - idx) % n) + n) % n;       // jarak dari tengah, berlaku untuk berapa pun jumlah paket
                    if (o > n / 2) o -= n;
                    const a = Math.abs(o);
                    const t = Math.min(a, 2);                // indeks ukuran (0,1,2)
                    const mid = a === 0;
                    const lebar = mid ? Math.min(W[0] * sc, sw - 8) : W[t] * sc;
                    return (
                      <article
                        key={p.id}
                        className={"kartu" + (mid ? " mid" : a === 1 ? " near" : " far")}
                        style={{
                          display: a > maxA ? "none" : undefined,
                          width: lebar,
                          height: H[t],
                          marginLeft: -lebar / 2,
                          top: (STAGE_H - H[t]) / 2,
                          transform: `translateX(${Math.sign(o) * X[t] * sc * k}px)`,
                          opacity: OP[t],
                          zIndex: 3 - t,
                        }}
                        onClick={() => !mid && geser(o)}
                      >
                        <div className="foto" style={{ backgroundImage: `url(${p.gambar})` }} role="img" aria-label={p.nama} />
                        <small>Paket</small>
                        <h3>{p.nama}</h3>
                        <div className="harga">{p.harga}</div>
                        <ul>{p.isi.map((x) => <li key={x}>{x}</li>)}</ul>
                        {p.tambah.length > 0 && <ul className="tb">{p.tambah.map((x) => <li key={x}>{x}</li>)}</ul>}
                        <div className="tombol">
                          <button className="ambil" tabIndex={mid ? 0 : -1} onClick={(e) => { e.stopPropagation(); if (mid) { setPilih(p); setMetode(""); } }}>Dapatkan Paket</button>
                          <button className="edit" tabIndex={mid ? 0 : -1} onClick={(e) => { e.stopPropagation(); if (mid) bukaEdit(p); }}>
                            <Pencil size={15} aria-hidden="true" /> Edit paket
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <button className="arr" aria-label="Berikutnya" onClick={() => geser(1)}>›</button>
              </div>
            )}

            {tab === "jadwal" && (
  <div className="jadwal">
    {["Jumat", "Sabtu"].map((hari) => (
      <section key={hari} className="jgrup">
        <div className="jhead">
          <h2 className="jjudul">{hari}:</h2>
          {hari === "Jumat" && (
            <button type="button" className="tbh" onClick={bukaTambahJ}>
              <Plus size={16} aria-hidden="true" /> Tambah Event
            </button>
          )}
        </div>
        <div className="jlist">
          {jadwals.filter((j) => j.hari === hari).map((j, i) => (
            <article className="jcard" key={j.id} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="jaksi">
                <button type="button" aria-label={`Edit ${j.nama}`} onClick={() => bukaEditJ(j)}><Pencil size={14} aria-hidden="true" /></button>
                <button type="button" aria-label={`Hapus ${j.nama}`} onClick={() => setJHapus(j)}><Trash2 size={14} aria-hidden="true" /></button>
              </div>
              <div className="jfoto" style={{ backgroundImage: `url(${j.gambar})` }} role="img" aria-label={j.nama} />
              <div className="jcopy">
                <h3>{j.nama}</h3>
                <p className="jpill">Setiap {j.hari}, {j.jam} WIB</p>
                <h4>Tentang Kegiatan</h4>
                <p className="jdesc">{j.desc}</p>
              </div>
              <div className="jstat">
                <div className="jinfo"><span>Hari</span><strong>{j.hari}</strong></div>
                <div className="jinfo"><span>Jam</span><strong>{j.jam} WIB</strong></div>
              </div>
            </article>
          ))}
        </div>
      </section>
    ))}
  </div>
)}          </div>
        </main>
      </div>

      {/* ---------- Popup pemesanan ---------- */}
      {pilih && (
        <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && tutupPesan()}>
          <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="psn-judul">
            {!selesai ? (
              <>
                <div className="dlg-head">
                  <h2 id="psn-judul">Pemesanan Paket {pilih.nama}</h2>
                  <button type="button" className="tutup" onClick={tutupPesan} aria-label="Tutup"><IkonX size={20} /></button>
                </div>
                <p className="hg">{pilih.harga}</p>
                <label>Nama pemesan<input value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} /></label>
                <label>No. WhatsApp<input inputMode="tel" value={f.hp} onChange={(e) => setF({ ...f, hp: e.target.value })} /></label>
                <div className="dua">
                  <label>Tanggal kunjungan<input type="date" value={f.tgl} onChange={(e) => setF({ ...f, tgl: e.target.value })} /></label>
                  <label>Jumlah peserta<input type="number" min={1} value={f.jumlah} onChange={(e) => setF({ ...f, jumlah: e.target.value })} /></label>
                </div>
                <p className="grp">Metode pembayaran</p>
                <div className="bayar">
                  {BAYAR.map((m) => (
                    <label key={m} className={"opsi" + (metode === m ? " on" : "")}>
                      <input type="radio" name="b" checked={metode === m} onChange={() => setMetode(m)} />{m}
                    </label>
                  ))}
                </div>
                <button className="utama" disabled={!siap} onClick={() => setSelesai(true)}>Konfirmasi pesanan</button>
              </>
            ) : (
              <div className="sukses">
                <div className="ok">✓</div>
                <h2>Pesanan diterima</h2>
                <p>Paket {pilih.nama} untuk {f.jumlah} orang pada {f.tgl}, dibayar via {metode}.</p>
                <button className="utama" onClick={tutupPesan}>Tutup</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------- Popup edit paket ---------- */}
      {editing && (
        <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setEditing(null)}>
          <form className="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-judul" onSubmit={simpan}>
            <div className="dlg-head">
              <h2 id="dlg-judul">Edit Paket</h2>
              <button type="button" className="tutup" onClick={() => setEditing(null)} aria-label="Tutup"><IkonX size={20} /></button>
            </div>
            <label>Nama paket<input required value={pf.nama} onChange={(e) => setPf({ ...pf, nama: e.target.value })} /></label>
            <label>Harga<input required value={pf.harga} onChange={(e) => setPf({ ...pf, harga: e.target.value })} /></label>
            <label>Isi paket (satu baris satu poin)<textarea rows={5} value={pf.isi} onChange={(e) => setPf({ ...pf, isi: e.target.value })} /></label>
            <label>Tambahan (satu baris satu poin)<textarea rows={2} value={pf.tambah} onChange={(e) => setPf({ ...pf, tambah: e.target.value })} /></label>
            <label>{pf.gambar ? "Gambar telah ter-upload" : "Unggah gambar"}<input type="file" accept="image/*" onChange={(e) => unggah(e.currentTarget.files?.[0])} /></label>
            {errGambar && <p className="err" role="alert">{errGambar}</p>}
            {pf.gambar && <div className="pratinjau" style={{ backgroundImage: `url(${pf.gambar})` }} role="img" aria-label="Pratinjau gambar" />}
            <button type="submit" className="simpan">Simpan perubahan</button>
          </form>
        </div>
      )}

      {/* ---------- Popup tambah / edit event ---------- */}
{jEdit && (
  <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setJEdit(null)}>
    <form className="dialog" role="dialog" aria-modal="true" aria-labelledby="je-judul" onSubmit={simpanJ}>
      <div className="dlg-head">
        <h2 id="je-judul">{jEdit === "baru" ? "Tambah Event" : "Edit Event"}</h2>
        <button type="button" className="tutup" onClick={() => setJEdit(null)} aria-label="Tutup"><IkonX size={20} /></button>
      </div>
      <label>Nama event<input required value={jf.nama} onChange={(e) => setJf({ ...jf, nama: e.target.value })} /></label>
      <label>Hari kegiatan
        <select required value={jf.hari} onChange={(e) => setJf({ ...jf, hari: e.target.value })}>
          <option value="" disabled>Pilih hari</option>
          <option value="Jumat">Jumat</option>
          <option value="Sabtu">Sabtu</option>
        </select>
      </label>
      <label>Jam kegiatan (contoh: 09.00-13.00)<input value={jf.jam} onChange={(e) => setJf({ ...jf, jam: e.target.value })} /></label>
      <label>Tentang kegiatan<textarea rows={3} value={jf.desc} onChange={(e) => setJf({ ...jf, desc: e.target.value })} /></label>
      <label>{jf.gambar ? "Gambar telah ter-upload" : "Unggah gambar"}<input type="file" accept="image/*" onChange={(e) => unggahJ(e.currentTarget.files?.[0])} /></label>
      {errJ && <p className="err" role="alert">{errJ}</p>}
      {jf.gambar && <div className="pratinjau" style={{ backgroundImage: `url(${jf.gambar})` }} role="img" aria-label="Pratinjau gambar" />}
      <button type="submit" className="simpan">{jEdit === "baru" ? "Simpan event" : "Simpan perubahan"}</button>
    </form>
  </div>
)}

{/* ---------- Konfirmasi hapus event ---------- */}
{jHapus && (
  <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setJHapus(null)}>
    <div className="dialog kecil" role="alertdialog" aria-modal="true" aria-labelledby="jh-judul">
      <h2 id="jh-judul" className="jh-judul">Hapus event?</h2>
      <p className="jh-teks">Event “{jHapus.nama}” akan dihapus dari daftar.</p>
      <div className="jh-aksi">
        <button type="button" className="batal" onClick={() => setJHapus(null)}>Batal</button>
        <button type="button" className="hapus" onClick={hapusJ}>Hapus</button>
      </div>
    </div>
  </div>
)}

      <style jsx global>{`
        :root {
          --event-brown:#4a2a1f;
          --event-cream:#fff8ec;
          --event-card:#fffaf1;
          --event-ink:#201713;
          --event-muted:#6e5b4f;
          --event-gold:#c88424;
          --brown:var(--event-brown); --cream:var(--event-cream); --card:var(--event-card);
          --ink:var(--event-ink); --gold:var(--event-gold); --gold2:#7e4b1e;
          --line:#d9c9b6; --soft:#7a5a48;
        }
        body { margin:0; background:var(--event-cream); color:var(--event-ink); font:400 14px/1.55 Poppins, sans-serif; }
        *,*::before,*::after { box-sizing:border-box; }
        @keyframes naik { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
      `}</style>
      <style jsx>{`
        .event-app { min-height:100vh; display:flex; }
        .event-main { min-width:0; flex:1; padding:31px 32px 40px; position:relative; overflow:hidden; }
        .tabs { display:grid; grid-template-columns:repeat(2,1fr); border-bottom:1px solid var(--brown); margin-bottom:26px; }
        .tabs button { background:none; border:0; border-radius:12px 12px 0 0; margin-bottom:-1px; padding:12px 10px; font:600 15px Poppins,sans-serif; color:var(--brown); cursor:pointer; transition:background .3s,color .3s,opacity .3s; opacity:.7; }
        .tabs button.on { background:var(--brown); color:var(--cream); opacity:1; }
        button:focus-visible,input:focus-visible { outline:2px solid var(--gold); outline-offset:2px; }
        .view { animation:naik .45s ease both; }

        /* ---------- Carousel ---------- */
        .car { position:relative; display:flex; align-items:center; }
        .stage { position:relative; flex:1; height:${STAGE_H}px; touch-action:pan-y; }
        .kartu {
          position:absolute; left:50%;
          display:flex; flex-direction:column; overflow:hidden;
          background:var(--card); border:1px solid rgba(91,71,55,.25); border-radius:19px; box-shadow:0 1px 8px rgba(31,24,18,.42);
          padding:16px 16px 16px; color:var(--brown); cursor:pointer;
          transition:transform .55s cubic-bezier(.4,.1,.2,1), width .55s cubic-bezier(.4,.1,.2,1), height .55s cubic-bezier(.4,.1,.2,1),
                     top .55s cubic-bezier(.4,.1,.2,1), margin-left .55s cubic-bezier(.4,.1,.2,1), opacity .45s, background .45s, color .45s;
        }
        .kartu.mid { background:var(--brown); color:#fff; border-color:var(--brown); cursor:default; box-shadow:0 16px 34px rgba(74,42,31,.32); padding:20px 18px 18px; }
        .foto { flex:none; height:150px; border-radius:17px; background:#6b4a3a center/cover; box-shadow:0 2px 8px rgba(0,0,0,.5); margin-bottom:12px; }
        .near .foto { height:110px; }
        .far .foto { height:90px; margin-bottom:10px; }
        small { font-size:11px; opacity:.8; }
        h3 { margin:0 0 4px; font:700 17px/1.25 Poppins,sans-serif; }
        .near h3 { font-size:15px; }
        .far h3 { font-size:13px; }
        .harga { font:600 14px/1.3 Poppins,sans-serif; margin-bottom:10px; }
        .near .harga { font-size:13px; }
        .far .harga { font-size:12px; margin-bottom:8px; }

        ul { margin:0; padding:0; list-style:none; font-size:12px; line-height:1.45; color:var(--soft); }
        li { position:relative; padding-left:13px; margin-bottom:3px; }
        li::before { content:""; position:absolute; left:0; top:.6em; width:5px; height:5px; border-radius:50%; background:currentColor; opacity:.7; }
        .mid ul { color:#f0c862; }
        .tb { margin-top:8px; padding-top:8px; border-top:1px dashed currentColor; }
        .near ul { font-size:11px; }
        .near .tb, .near .tombol { display:none; }
        .far ul { font-size:11px; }
        .far li:nth-child(n+4), .far .tb, .far .tombol, .far small { display:none; }

        .ambil { margin-top:0; align-self:stretch; background:var(--cream); color:var(--brown); border:1px solid var(--brown); border-radius:999px; padding:9px 0; font:600 13px Poppins,sans-serif; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,.2); transition:transform .2s; }
        .tombol { margin-top:auto; padding-top:14px; display:flex; flex-direction:column; gap:8px; }
        .edit { display:flex; align-items:center; justify-content:center; gap:6px; padding:8px 0; background:transparent; border:1px solid var(--cream); color:var(--cream); border-radius:999px; font:500 13px Poppins,sans-serif; cursor:pointer; transition:background .2s,color .2s; }
        .edit:hover { background:var(--cream); color:var(--brown); }
        .mid .ambil { background:var(--gold); border-color:var(--gold); }
        .ambil:hover { transform:translateY(-1px); }
        .arr { flex:none; z-index:5; width:32px; height:32px; border-radius:50%; border:0; background:var(--brown); color:#fff; font-size:20px; line-height:1; cursor:pointer; transition:transform .2s; }
        .arr:hover { transform:scale(1.12); }

        /* ---------- Jadwal rutin ---------- */
        .jadwal { display:flex; flex-direction:column; gap:60px; padding-top:30px; }
        .jlist { display:flex; flex-direction:column; gap:21px; }
        .jjudul { margin:0; color:#563327; font:600 16px/1.4 Poppins,sans-serif; }
        .jcard { display:grid; grid-template-columns:minmax(175px,28%) minmax(0,1fr) 155px; align-items:center; gap:12px 24px; min-height:210px; padding:18px 20px; background:var(--card); border:1px solid rgba(91,71,55,.25); border-radius:19px; box-shadow:0 1px 8px rgba(31,24,18,.42); transition:translate .28s ease,box-shadow .28s ease,border-color .28s ease; animation:naik .55s cubic-bezier(.2,.7,.2,1) both; }
        .jcard:hover { translate:0 -4px; border-color:rgba(200,132,36,.55); box-shadow:0 10px 24px rgba(31,24,18,.16); }
        .jfoto { height:156px; border-radius:17px; background:#6b4a3a center/cover; box-shadow:0 2px 8px rgba(0,0,0,.5); }
        .jcopy { min-width:0; }
        .jcopy h3 { margin:0; color:#111; font:700 16px/1.35 Poppins,sans-serif; }
        .jpill { width:fit-content; margin:7px 0 12px; padding:5px 10px; border-radius:999px; background:#f3e7d3; color:#7e4b1e; font-size:11px; font-weight:600; }
        .jcopy h4 { margin:0 0 8px; font-size:11px; line-height:1.4; font-weight:600; }
        .jdesc { margin:0; max-width:390px; color:#51443c; font-size:11px; line-height:1.55; }
        .jstat { min-height:108px; display:flex; flex-direction:column; justify-content:center; gap:10px; padding:15px 20px; border:1px solid #d2c5b4; border-radius:17px; background:var(--cream); box-shadow:0 1px 5px rgba(0,0,0,.22); }
        .jinfo { display:flex; flex-direction:column; }
        .jinfo span { color:#9d8978; font-size:10px; line-height:1.45; }
        .jinfo strong { color:#48291d; font-size:12px; font-weight:600; line-height:1.45; }
        .jhead { display:flex; align-items:center; justify-content:space-between; margin:0 0 13px 12px; }
.tbh { display:flex; align-items:center; gap:8px; padding:10px 18px; border:0; border-radius:8px; background:var(--brown); color:var(--cream); font:500 13px Poppins,sans-serif; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,.25); transition:transform .2s; }
.tbh:hover { transform:translateY(-1px); }
.jcard { position:relative; }
.jaksi { position:absolute; top:14px; right:20px; display:flex; gap:8px; z-index:2; }
.jaksi button { display:grid; place-items:center; width:30px; height:30px; border:1px solid #d2c5b4; border-radius:7px; background:var(--cream); color:var(--brown); cursor:pointer; transition:background .2s,color .2s; }
.jaksi button:hover { background:var(--brown); color:var(--cream); }
.jstat { margin-top:22px; }
.dialog select { display:block; width:100%; margin-top:5px; padding:9px 10px; border:1px solid #d9c9b6; border-radius:7px; background:#fffdf9; color:var(--ink); font:400 13px Poppins,sans-serif; }
.dialog.kecil { width:min(400px,100%); }
.jh-judul { margin:0 0 8px; color:var(--brown); font:600 17px Poppins,sans-serif; }
.jh-teks { margin:0 0 18px; color:var(--event-muted); font-size:12px; }
.jh-aksi { display:flex; justify-content:flex-end; gap:8px; }
.jh-aksi button { padding:8px 16px; border-radius:6px; font:500 12px Poppins,sans-serif; cursor:pointer; }
.batal { border:1px solid var(--line); background:var(--cream); color:var(--brown); }
.hapus { border:0; background:#a9372c; color:#fff; }

        /* ---------- Popup (dipakai pemesanan & edit) ---------- */
        .overlay { position:fixed; inset:0; z-index:30; display:grid; place-items:center; padding:18px; background:rgba(35,22,16,.56); animation:naik .2s ease both; }
        .dialog { width:min(460px,100%); max-height:92vh; overflow:auto; padding:23px; border-radius:14px; background:var(--cream); box-shadow:0 14px 45px rgba(0,0,0,.24); }
        .dlg-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
        .dlg-head h2 { margin:0; color:var(--brown); font:600 20px Poppins,sans-serif; }
        .tutup { display:grid; place-items:center; padding:5px; border:0; background:transparent; color:var(--brown); cursor:pointer; }
        .dialog label { display:block; margin:12px 0 0; color:var(--brown); font-size:12px; font-weight:500; }
        .dialog input:not([type=radio]), .dialog textarea { display:block; width:100%; margin-top:5px; padding:9px 10px; border:1px solid #d9c9b6; border-radius:7px; background:#fffdf9; color:var(--ink); font:400 13px Poppins,sans-serif; }
        .dialog input[type=file] { padding:7px; }
        .dialog input[type=file]::file-selector-button { margin-right:10px; padding:6px 10px; border:0; border-radius:5px; background:#f3e7d3; color:var(--brown); font:500 12px Poppins,sans-serif; cursor:pointer; }
        .dialog textarea { resize:vertical; }
        .dialog input:focus, .dialog textarea:focus { outline:2px solid #c88424; outline-offset:1px; }
        .pratinjau { height:150px; margin-top:9px; border-radius:8px; background:#6b4a3a center/cover; }
        .err { margin:7px 0 0; color:#b3261e; font-size:12px; }
        .simpan { width:100%; margin-top:20px; padding:10px; border:0; border-radius:7px; background:var(--brown); color:#fff; font:500 13px Poppins,sans-serif; cursor:pointer; }

        /* ---------- Isi popup pemesanan ---------- */
        .hg { margin:0 0 4px; color:var(--gold2); font-size:13px; font-weight:600; }
        .dua { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .grp { margin:16px 0 6px; color:var(--brown); font-size:12px; font-weight:500; }
        .bayar { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; }
        .dialog .opsi { display:flex; align-items:center; gap:8px; margin:0; padding:9px 12px; border:1px solid var(--line); border-radius:7px; background:#fffdf9; color:var(--ink); font-size:13px; cursor:pointer; transition:background .25s,border-color .25s; }
        .dialog .opsi.on { border-color:var(--gold); background:#fdf1d4; }
        .utama { width:100%; margin-top:20px; padding:10px; border:0; border-radius:7px; background:var(--brown); color:#fff; font:500 13px Poppins,sans-serif; cursor:pointer; }
        .utama:disabled { opacity:.45; cursor:not-allowed; }
        .sukses { text-align:center; }
        .ok { width:60px; height:60px; margin:0 auto 10px; border-radius:50%; background:var(--gold); color:var(--brown); font-size:30px; display:grid; place-items:center; }
        .sukses h2 { margin:0; color:var(--brown); font:600 20px Poppins,sans-serif; }
        .sukses p { margin:10px 0 0; color:var(--event-muted); font-size:13px; }

        /* ---------- Responsif ---------- */
        @media (min-width:1200px) { .event-main { padding-right:38px; padding-left:28px; } }
        @media (max-width:850px) {
          .event-main { padding:26px 20px 36px; }
          .jcard { grid-template-columns:minmax(140px,25%) minmax(0,1fr) 135px; gap:16px; padding:14px; }
        }
        @media (max-width:650px) {
          .event-app { display:block; }
          .event-main { padding:24px 16px 36px; }
          .tabs button { font-size:13px; padding:10px 2px; }
          .jcard { grid-template-columns:130px minmax(0,1fr); gap:14px; padding:14px; }
          .jfoto { height:122px; }
          .jstat { grid-column:2; min-height:unset; flex-direction:row; gap:20px; padding:8px 10px; border-radius:10px; }
          .dua, .bayar { grid-template-columns:1fr; }
          .jcopy h3 { padding-right:76px; }
          .jstat { margin-top:0; }
        }
        @media (max-width:420px) { .event-main { padding-right:12px; padding-left:12px; } }
        @media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation-duration:.01ms !important; transition-duration:.01ms !important; } }
      `}</style>
    </>
  );
}