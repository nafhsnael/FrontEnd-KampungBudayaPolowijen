// src/pages/admin/paket.tsx
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";

type Paket = { id: number; nama: string; harga: string; gambar: string; isi: string[]; tambah: string[] };
type Tab = "paket" | "jadwal";

const PAKET: Paket[] = [
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
const JADWAL = [
  { hari: "Jumat", nama: "Sarasehan Budaya Malang", jam: "19.00-21.00", gambar: "/images/paket/sambang-kampung.jpeg", desc: "Sarasehan budaya yang membahas Macapat, Topeng, dan Wayang." },
  { hari: "Sabtu", nama: "Bantengan / Jaranan", jam: "09.00-13.00", gambar: "/images/paket/tarian1.jpeg", desc: "Sesi Bantengan dan Jaranan setiap Sabtu pagi." },
  { hari: "Sabtu", nama: "Gladhi Tari Tradisi", jam: "13.00-15.00", gambar: "/images/paket/tarian.jpeg", desc: "Gladhi atau latihan tari tradisi bersama." },
  { hari: "Sabtu", nama: "Hasta Karya / Liwetan", jam: "13.00-15.00", gambar: "/images/paket/lukis-topeng.jpeg", desc: "Kegiatan hasta karya dan liwetan bersama." },
  { hari: "Sabtu", nama: "Gladhi Tari Topeng", jam: "15.00-17.00", gambar: "/images/paket/tarian.jpeg", desc: "Gladhi atau latihan tari Topeng Malang." },
  { hari: "Sabtu", nama: "Sinau Budaya", jam: "15.00-17.00", gambar: "/images/paket/kupatan.jpeg", desc: "Sinau budaya, adat, dan tradisi Kampung Budaya Polowijen." },
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
  }, [tab, pilih]);
  const maxA = sw >= LEBAR_5 ? 2 : sw >= LEBAR_3 ? 1 : 0;           // jarak terjauh yang ditampilkan
  const sc = maxA === 2 ? Math.min(1, sw / LEBAR_PENUH) : 1;          // kecilkan lebar & jarak kartu kalau area kurang lebar
  const k = Math.min(1.15, Math.max(1, (sw / 2 - 115) / X[2]));      // renggangkan jarak kalau layar lebar
  const n = PAKET.length;
  const geser = (d: number) => setIdx((i) => (i + d + n) % n);
  const siap = f.nama.trim() && f.hp.trim() && f.tgl && +f.jumlah > 0 && metode;
  const pindahTab = (t: Tab) => { setTab(t); setPilih(null); setSelesai(false); };

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
            {([["paket", "Paket Kunjungan"], ["jadwal", "Jadwal Rutin dan Event"]] as [Tab, string][]).map(([t, l]) => (
              <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => pindahTab(t)}>{l}</button>
            ))}
          </div>

          <div className="view" key={tab + (pilih ? "p" : "") + selesai}>
            {tab === "paket" && !pilih && (
              <div className="car">
                <button className="arr" aria-label="Sebelumnya" onClick={() => geser(-1)}>‹</button>
                <div
                  className="stage"
                  ref={stageRef}
                  onTouchStart={(e) => { sx.current = e.touches[0].clientX; }}
                  onTouchEnd={(e) => swipeEnd(e.changedTouches[0].clientX)}
                >
                  {PAKET.map((p, i) => {
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
                        <button className="ambil" tabIndex={mid ? 0 : -1} onClick={(e) => { e.stopPropagation(); if (mid) { setPilih(p); setMetode(""); } }}>Dapatkan Paket</button>
                      </article>
                    );
                  })}
                </div>
                <button className="arr" aria-label="Berikutnya" onClick={() => geser(1)}>›</button>
              </div>
            )}

            {tab === "paket" && pilih && !selesai && (
              <div className="pesan">
                <button className="back" onClick={() => setPilih(null)}>← Kembali</button>
                <div className="box">
                  <h2>Pemesanan Paket {pilih.nama}</h2>
                  <p className="hg">{pilih.harga}</p>
                  <label>Nama pemesan<input value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} /></label>
                  <label>No. WhatsApp<input inputMode="tel" value={f.hp} onChange={(e) => setF({ ...f, hp: e.target.value })} /></label>
                  <div className="dua">
                    <label>Tanggal kunjungan<input type="date" value={f.tgl} onChange={(e) => setF({ ...f, tgl: e.target.value })} /></label>
                    <label>Jumlah peserta<input type="number" min={1} value={f.jumlah} onChange={(e) => setF({ ...f, jumlah: e.target.value })} /></label>
                  </div>
                  <p className="grp">Metode pembayaran</p>
                  <div className="bayar">{BAYAR.map((m) => <label key={m} className={"opsi" + (metode === m ? " on" : "")}><input type="radio" name="b" checked={metode === m} onChange={() => setMetode(m)} />{m}</label>)}</div>
                  <button className="utama" disabled={!siap} onClick={() => setSelesai(true)}>Konfirmasi pesanan</button>
                </div>
              </div>
            )}

            {tab === "paket" && pilih && selesai && (
              <div className="box center">
                <div className="ok">✓</div>
                <h2>Pesanan diterima</h2>
                <p>Paket {pilih.nama} untuk {f.jumlah} orang pada {f.tgl}, dibayar via {metode}.</p>
                <button className="utama" onClick={() => { setPilih(null); setSelesai(false); }}>Kembali ke daftar paket</button>
              </div>
            )}

            {tab === "jadwal" && (
  <div className="jadwal">
    {["Jumat", "Sabtu"].map((hari) => (
      <section key={hari} className="jgrup">
        <h2 className="jjudul">{hari}:</h2>
        <div className="jlist">
          {JADWAL.filter((j) => j.hari === hari).map((j, i) => (
            <article className="jcard" key={j.nama} style={{ animationDelay: `${i * 80}ms` }}>
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
)}
          </div>
        </main>
      </div>

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
        .near .tb, .near .ambil { display:none; }
        .far ul { font-size:11px; }
        .far li:nth-child(n+4), .far .tb, .far .ambil, .far small { display:none; }

        .ambil { margin-top:auto; align-self:stretch; background:var(--cream); color:var(--brown); border:1px solid var(--brown); border-radius:999px; padding:9px 0; font:600 13px Poppins,sans-serif; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,.2); transition:transform .2s; }
        .mid .ambil { background:var(--gold); border-color:var(--gold); }
        .ambil:hover { transform:translateY(-1px); }
        .arr { flex:none; z-index:5; width:32px; height:32px; border-radius:50%; border:0; background:var(--brown); color:#fff; font-size:20px; line-height:1; cursor:pointer; transition:transform .2s; }
        .arr:hover { transform:scale(1.12); }

        /* ---------- Jadwal rutin ---------- */
        .jadwal { display:flex; flex-direction:column; gap:60px; padding-top:30px; }
        .jlist { display:flex; flex-direction:column; gap:21px; }
        .jjudul { margin:0 0 13px 12px; color:#563327; font:600 16px/1.4 Poppins,sans-serif; }
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

        /* ---------- Form pemesanan ---------- */
        .pesan,.box { max-width:520px; margin:0 auto; }
        .back,.utama { background:var(--brown); color:#fff; border:0; border-radius:999px; padding:9px 20px; font:600 13px Poppins,sans-serif; cursor:pointer; }
        .back { background:none; color:var(--brown); border:1px solid var(--brown); margin-bottom:14px; }
        .utama { width:100%; margin-top:18px; padding:12px; background:var(--gold); color:var(--brown); }
        .utama:disabled { opacity:.45; cursor:not-allowed; }
        .box { background:var(--card); border:1px solid var(--line); border-radius:18px; padding:22px; }
        .box h2 { margin:0; font:700 19px Poppins,sans-serif; color:var(--brown); }
        .hg { color:var(--gold2); font-weight:600; margin:2px 0 6px; }
        label { display:block; font-weight:500; margin-top:12px; }
        input:not([type=radio]) { display:block; width:100%; margin-top:4px; padding:9px 12px; border:1px solid var(--line); border-radius:10px; background:#fff; font:inherit; color:var(--ink); }
        .dua { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .grp { font-weight:600; margin:16px 0 6px; color:var(--brown); }
        .bayar { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; }
        .opsi { display:flex; align-items:center; gap:8px; margin:0; padding:9px 12px; border:1px solid var(--line); border-radius:10px; cursor:pointer; transition:background .25s,border-color .25s; }
        .opsi.on { border-color:var(--gold); background:#fdf1d4; }
        .center { text-align:center; }
        .ok { width:60px; height:60px; margin:0 auto 10px; border-radius:50%; background:var(--gold); color:var(--brown); font-size:30px; display:grid; place-items:center; }

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
          .dua,.bayar { grid-template-columns:1fr; }
        }
        @media (max-width:420px) { .event-main { padding-right:12px; padding-left:12px; } }
        @media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation-duration:.01ms !important; transition-duration:.01ms !important; } }
      `}</style>
    </>
  );
}