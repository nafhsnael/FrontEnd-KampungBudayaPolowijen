// src/pages/admin/paket.tsx
import Head from "next/head";
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";

type Paket = { id: number; nama: string; harga: string; gambar: string | null; isi: string[] };
type Tab = "paket" | "rutin" | "event";
type Layar = "list" | "detail" | "bayar" | "sukses";

// Isi gambar dengan path dari folder public, contoh: "/image/paket/sambang.jpg"
const AWAL: Paket[] = [
  { id: 1, nama: "Paket Sambang Kampung", harga: "Maks. 30 org 1 jt, selebihnya 30 rb/org", gambar: "/images/paket/sambang-kampung.jpeg", isi: ["Sinau budaya adat dan tradisi", "Sajian tari tradisi/topeng", "Bebas dokumentasi", "Demo membatik/topeng", "Kudapan jananan lawas", "Omben2 jamu/dawet", "+Tambah makan sego berkat 20 rb/orang", "+Tambah edukasi cek di paket Hasta Karya"] },
  { id: 2, nama: "Paket Sobo Pasar", harga: "30 rb/org", gambar: "/images/paket/lukis-topeng.jpeg", isi: ["Sedia busana tradisional", "Bebas dokumentasi", "Masak Cethik Geni Pawon", "Membatik/mewarnai kerajinan", "Medayoh ke omah warga", "Omben2 kopi/rempah2", "+Tambah makan sego berkat 20 rb/orang", "+Tambah edukasi cek di paket Hasta Karya"] },
  { id: 3, nama: "Paket Medayoh", harga: "@ 30 rb/org", gambar: "/images/paket/tarian1.jpeg", isi: ["Khusus Sabtu (13.00-17.00)", "Kelompok 3-10 org", "Sinau budaya & wawancara", "Bebas dokumentasi", "Sajian gladhi tari Topeng", "Omben2 dan jananan lawas", "+Tambah makan sego berkat 20 rb/orang", "+Tambah edukasi cek di paket Hasta Karya"] },
  { id: 4, nama: "Paket Selametan / Metri", harga: "1 jt untuk 20 org", gambar: "/images/paket/tarian.jpeg", isi: ["Cocok untuk metri weton (ulang tahun kelahiran, pernikahan)", "Memakai busana adat", "Sego tumpeng/sego berkat", "Jenang sengkolo", "Jajanan lawas, wedangan, ngopi", "Bisa dekorasi, bebas dokumentasi"] },
  { id: 5, nama: "Paket Hasta Karya", harga: "mulai 25 rb/org", gambar: "/images/paket/kupatan.jpeg", isi: ["Membatik topeng 100 rb/org", "Membatik/ecoprint 50 rb/org", "Melukis topeng 35 rb/org", "Melukis jaranan 25 rb/org", "Melukis anyaman bambu 25 rb/org", "Melukis wayang 25 rb/org"] },
];
const RUTIN = [
  ["Jumat", "19.00-21.00", "Sarasehan Budaya Malang (macopat, topeng, wayang)"],
  ["Sabtu", "09.00-13.00", "Bantengan/Jaranan"], ["Sabtu", "13.00-15.00", "Gladhi Tari Tradisi"],
  ["Sabtu", "13.00-15.00", "Hasta Karya/Liwetan"], ["Sabtu", "15.00-17.00", "Gladhi Tari Topeng"], ["Sabtu", "15.00-17.00", "Sinau Budaya"],
];
const EVENT = [
  ["31 Februari", "Megengan & Nyadran"], ["18 April", "Festival Kampung Budaya Polowijen #8"], ["19 April", "Riyoyo Kupatan"],
  ["20 April", "Peringatan Hari Kartini"], ["19 Juli", "Suroan, Nyekar Topeng Malang"], ["5 Oktober", "Festival Batik Polowijen"],
  ["25 Oktober", "Festival Topeng Malang"], ["21 Desember", "Peringatan Hari Ibu"],
];
const BAYAR = [
  { g: "Transfer Bank", m: ["BCA", "Mandiri", "BRI"] },
  { g: "E-Wallet", m: ["GoPay", "OVO", "DANA"] },
  { g: "Lainnya", m: ["QRIS", "Bayar di lokasi"] },
];

export default function PaketAdmin() {
  const [tab, setTab] = useState<Tab>("paket");
  const [daftar, setDaftar] = useState<Paket[]>(AWAL);
  const [layar, setLayar] = useState<Layar>("list");
  const [aktif, setAktif] = useState<Paket | null>(null);
  const [keranjang, setKeranjang] = useState<number[]>([]);
  const [toast, setToast] = useState("");
  const [metode, setMetode] = useState("");
  const [form, setForm] = useState<{ id: number | null; nama: string; harga: string; gambar: string | null; isi: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const buka = (p: Paket) => { setAktif(p); setLayar("detail"); };
  const bukaForm = (p?: Paket) =>
    setForm({ id: p?.id ?? null, nama: p?.nama ?? "", harga: p?.harga ?? "", gambar: p?.gambar ?? null, isi: p ? p.isi.join("\n") : "" });

  const simpan = () => {
    if (!form || !form.nama.trim()) return;
    const d = { nama: form.nama.trim(), harga: form.harga.trim(), gambar: form.gambar, isi: form.isi.split("\n").map((s) => s.trim()).filter(Boolean) };
    // TODO: sambungkan ke API/database
    const baru = { id: form.id ?? Date.now(), ...d };
    setDaftar((l) => (form.id === null ? [...l, baru] : l.map((p) => (p.id === form.id ? baru : p))));
    if (aktif && aktif.id === baru.id) setAktif(baru);
    setForm(null);
  };

  const masukKeranjang = () => {
    if (!aktif) return;
    if (keranjang.includes(aktif.id)) return setToast("Paket ini sudah ada di keranjang");
    setKeranjang((k) => [...k, aktif.id]);
    setToast("Berhasil masuk ke keranjang ✓");
  };

  return (
    <>
      <Head>
        <title>Paket Kunjungan | Kampung Budaya Polowijen</title>
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div className="app">
        <AdminSidebar activeRoute="paket" />

        <main>
          <div className="top">
            <div>
              <h1>Paket Kunjungan</h1>
              <p className="sub">Kelola paket, jadwal rutin, dan event Kampung Budaya Polowijen.</p>
            </div>
            <div className="tr">
              <span className="cart" title="Keranjang">🛒 <b>{keranjang.length}</b></span>
              {tab === "paket" && layar === "list" && <button className="pri" onClick={() => bukaForm()}>Tambah paket</button>}
            </div>
          </div>

          <div className="tabs" role="tablist">
            {(["paket", "rutin", "event"] as Tab[]).map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => { setTab(t); setLayar("list"); }}>
                {t === "paket" ? "Paket" : t === "rutin" ? "Jadwal rutin" : "Jadwal event"}
              </button>
            ))}
          </div>

          {/* key membuat animasi masuk diputar ulang tiap pindah layar/tab */}
          <div className="view" key={tab + layar}>
            {tab === "paket" && layar === "list" && (
              <div className="grid">
                {daftar.map((p, i) => (
                  <article className="kartu" key={p.id} style={{ animationDelay: `${i * 70}ms` }}>
                    <button className="foto" onClick={() => buka(p)} aria-label={`Buka ${p.nama}`}>
                      {p.gambar ? <img src={p.gambar} alt={p.nama} /> : <span className="ph"><Logo s={54} /></span>}
                    </button>
                    <h3 onClick={() => buka(p)}>{p.nama}</h3>
                    <button className="edit" onClick={() => bukaForm(p)}>Edit</button>
                  </article>
                ))}
              </div>
            )}

            {tab === "paket" && layar === "detail" && aktif && (
              <div className="detail">
                <button className="back" onClick={() => setLayar("list")}>← Kembali</button>
                <div className="dcard">
                  <div className="dfoto">{aktif.gambar ? <img src={aktif.gambar} alt={aktif.nama} /> : <span className="ph"><Logo s={70} /></span>}</div>
                  <div className="dbody">
                    <h2>{aktif.nama}</h2>
                    <span className="price">{aktif.harga}</span>
                    <ul>{aktif.isi.map((x, i) => (x.startsWith("+") ? <li key={i} className="tambah">{x.slice(1)}</li> : <li key={i}>{x}</li>))}</ul>
                    <div className="acts">
                      <button className="edit" onClick={() => bukaForm(aktif)}>Edit</button>
                      <button onClick={masukKeranjang}>Masukkan ke keranjang</button>
                      <button className="pri" onClick={() => setLayar("bayar")}>Ambil Paket</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "paket" && layar === "bayar" && aktif && (
              <div className="detail">
                <button className="back" onClick={() => setLayar("detail")}>← Kembali</button>
                <div className="panel">
                  <h2>Metode Pembayaran</h2>
                  <p className="sub">{aktif.nama} · {aktif.harga}</p>
                  {BAYAR.map((g) => (
                    <div key={g.g}>
                      <p className="grp">{g.g}</p>
                      {g.m.map((m) => (
                        <label key={m} className={"opsi" + (metode === m ? " on" : "")}>
                          <input type="radio" name="bayar" checked={metode === m} onChange={() => setMetode(m)} /> {m}
                        </label>
                      ))}
                    </div>
                  ))}
                  <button className="pri full" disabled={!metode} onClick={() => setLayar("sukses")}>Bayar sekarang</button>
                </div>
              </div>
            )}

            {tab === "paket" && layar === "sukses" && aktif && (
              <div className="panel center">
                <div className="ok">✓</div>
                <h2>Paket berhasil diambil</h2>
                <p className="sub">{aktif.nama} · dibayar via {metode}</p>
                <button className="pri" onClick={() => { setLayar("list"); setMetode(""); }}>Kembali ke daftar paket</button>
              </div>
            )}

            {tab === "rutin" && (
              <div className="panel">
                {["Jumat", "Sabtu"].map((h) => (
                  <div key={h}><h2>{h}</h2>{RUTIN.filter((r) => r[0] === h).map((r, i) => <div className="row" key={i}><b>{r[1]}</b><span>{r[2]}</span></div>)}</div>
                ))}
              </div>
            )}
            {tab === "event" && (
              <div className="panel">{EVENT.map((e, i) => <div className="row" key={i}><b>{e[0]}</b><span>{e[1]}</span></div>)}</div>
            )}
          </div>

          
        </main>
      </div>

      {toast && <div className="toast" role="status">{toast}</div>}

      {form && (
        <div className="overlay" onClick={() => setForm(null)}>
          <div className="dlg" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2>{form.id === null ? "Tambah paket" : "Edit paket"}</h2>
            <label>Gambar</label>
            {form.gambar && <img className="prev" src={form.gambar} alt="Pratinjau" />}
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setForm({ ...form, gambar: URL.createObjectURL(f) }); }} />
            <label>Nama paket</label>
            <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
            <label>Harga utama</label>
            <input value={form.harga} placeholder="Contoh: 30 rb/orang" onChange={(e) => setForm({ ...form, harga: e.target.value })} />
            <label>Poin penjelasan (satu baris satu poin, awali + untuk tambahan)</label>
            <textarea rows={6} value={form.isi} onChange={(e) => setForm({ ...form, isi: e.target.value })} />
            <div className="dacts"><button onClick={() => setForm(null)}>Batal</button><button className="pri" onClick={simpan}>Simpan</button></div>
          </div>
        </div>
      )}

      <style jsx global>{`
        :root { --brown:#4a2a1f; --cream:#fff8ec; --card:#fffdf8; --red:#b3261e; --gold:#d9a520; --ink:#3a2219; --line:#ead9bf; --muted:#7d6556; }
        body { margin:0; background:var(--cream); color:var(--ink); font:400 14px/1.6 Poppins,system-ui,sans-serif; }
        *,*::before,*::after { box-sizing:border-box; }
        @keyframes naik { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
        @keyframes pop { from { opacity:0; transform:translate(-50%,16px); } to { opacity:1; transform:translate(-50%,0); } }
        @keyframes fade { from { opacity:0; } to { opacity:1; } }
        @keyframes zoom { from { opacity:0; transform:scale(.94); } to { opacity:1; transform:none; } }
      `}</style>
      <style jsx>{`
        .app { display:flex; min-height:100vh; }
        main { flex:1; min-width:0; padding:28px 32px 48px; }
        .top { display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:18px; }
        .tr { display:flex; align-items:center; gap:14px; }
        .cart { background:var(--card); border:1px solid var(--line); border-radius:999px; padding:5px 14px; }
        h1 { font:400 38px/1.1 "Great Vibes",cursive; color:var(--brown); margin:0; }
        .sub { color:var(--muted); margin:2px 0 0; }
        button { font:500 13px Poppins,sans-serif; cursor:pointer; border-radius:999px; border:1px solid var(--brown); background:transparent; color:var(--brown); padding:7px 16px; transition:transform .2s,background .25s,box-shadow .25s; }
        button:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 4px 10px rgba(74,42,31,.15); }
        button:disabled { opacity:.45; cursor:not-allowed; }
        button:focus-visible,input:focus-visible,textarea:focus-visible { outline:2px solid var(--gold); outline-offset:2px; }
        .pri { background:var(--gold); border-color:var(--gold); }
        .full { width:100%; margin-top:18px; padding:11px; }
        .tabs { display:flex; gap:6px; border-bottom:1px solid var(--line); margin-bottom:22px; overflow-x:auto; }
        .tabs button { border:0; border-radius:0; padding:10px 16px; color:var(--muted); border-bottom:3px solid transparent; white-space:nowrap; box-shadow:none; }
        .tabs button.on { color:var(--red); border-bottom-color:var(--red); }
        .view { animation:naik .45s ease both; }
        .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:20px; }
        .kartu { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:10px 10px 14px; display:flex; flex-direction:column; align-items:center; text-align:center; animation:naik .5s ease both; transition:transform .3s,box-shadow .3s; }
        .kartu:hover { transform:translateY(-4px); box-shadow:0 10px 22px rgba(74,42,31,.14); }
        .foto { all:unset; cursor:pointer; display:block; width:100%; aspect-ratio:4/3; border-radius:10px; overflow:hidden; }
        .foto img,.dfoto img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s; }
        .kartu:hover img { transform:scale(1.05); }
        .ph { width:100%; height:100%; display:grid; place-items:center; background:linear-gradient(135deg,#5e3a2d,#4a2a1f 60%,#7a4a38); }
        h3 { margin:12px 6px 10px; font:600 15px Poppins; color:var(--brown); cursor:pointer; flex:1; }
        .edit { padding:5px 18px; }
        .back { margin-bottom:14px; }
        .dcard { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.2fr); gap:24px; background:var(--card); border:1px solid var(--line); border-radius:16px; padding:18px; max-width:900px; }
        .dfoto { border-radius:12px; overflow:hidden; min-height:240px; animation:zoom .5s ease both; }
        .dbody h2 { font:600 22px Poppins; color:var(--brown); margin:0; }
        .price { display:block; color:#a87a10; font-weight:500; margin:2px 0 8px; }
        ul { margin:0; padding-left:20px; }
        li { margin-bottom:4px; }
        li.tambah { color:var(--red); }
        .acts { display:flex; gap:8px; flex-wrap:wrap; margin-top:18px; }
        .panel { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:8px 22px 22px; max-width:560px; }
        .panel h2 { font:400 30px "Great Vibes",cursive; color:var(--red); margin:14px 0 4px; }
        .center { text-align:center; padding:28px 22px; }
        .ok { width:64px; height:64px; margin:0 auto; border-radius:50%; background:var(--gold); color:var(--brown); font-size:32px; display:grid; place-items:center; animation:zoom .5s ease both; }
        .grp { font-weight:600; margin:16px 0 6px; color:var(--brown); }
        .opsi { display:flex; align-items:center; gap:10px; padding:10px 14px; margin-bottom:6px; border:1px solid var(--line); border-radius:10px; cursor:pointer; transition:background .25s,border-color .25s; }
        .opsi.on { border-color:var(--gold); background:#fdf1d4; }
        .row { display:flex; gap:16px; padding:10px 0; border-bottom:1px solid var(--line); }
        .row:last-child { border:0; }
        .row b { flex:none; min-width:112px; color:var(--brown); }
        .cp { max-width:760px; background:var(--gold); color:var(--brown); border-radius:999px; padding:10px 22px; font-weight:600; margin-top:26px; }
        .addr { color:var(--muted); margin:10px 4px 0; }
        .toast { position:fixed; left:50%; bottom:calc(24px + env(safe-area-inset-bottom,0px)); transform:translateX(-50%); background:var(--brown); color:#fff; padding:11px 22px; border-radius:999px; border:1px solid var(--gold); z-index:30; animation:pop .35s ease both; box-shadow:0 8px 20px rgba(0,0,0,.25); }
        .overlay { position:fixed; inset:0; background:rgba(74,42,31,.55); display:grid; place-items:center; z-index:20; padding:16px; animation:fade .25s ease both; }
        .dlg { background:var(--cream); border-radius:16px; width:min(480px,100%); padding:22px; max-height:90vh; overflow:auto; animation:zoom .3s ease both; }
        .dlg h2 { font:400 32px "Great Vibes",cursive; color:var(--brown); margin:0 0 6px; }
        .prev { width:100%; max-height:160px; object-fit:cover; border-radius:10px; margin-bottom:8px; }
        label { display:block; font-weight:500; margin:10px 0 4px; }
        input:not([type=radio]),textarea { width:100%; font:inherit; padding:9px 12px; border:1px solid var(--line); border-radius:10px; background:#fff; color:var(--ink); }
        .dacts { display:flex; justify-content:flex-end; gap:8px; margin-top:14px; }
        @media (max-width:760px) {
          main { padding:20px 16px 40px; }
          h1 { font-size:32px; }
          .grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
          .dcard { grid-template-columns:1fr; }
          .row { flex-direction:column; gap:0; }
        }
        @media (max-width:650px) { .app { display:block; } }
        @media (prefers-reduced-motion:reduce) { * { animation:none !important; transition:none !important; } }
      `}</style>
    </>
  );
}

function Logo({ s }: { s: number }) {
  return (
    <svg width={s} viewBox="0 0 60 70" aria-hidden="true">
      <path d="M30 2 56 66H4Z" fill="#c98a6b" /><path d="M30 14 46 60H14Z" fill="#4a2a1f" />
      <path d="M30 24c7 4 8 12 2 18-5 5-9 8-9 14 7 1 13-5 13-14 0-8-3-13-6-18Z" fill="#e3b49a" />
    </svg>
  );
}