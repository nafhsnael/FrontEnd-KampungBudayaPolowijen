import Head from "next/head";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { CalendarDays, Pencil, Plus, Trash2, X } from "lucide-react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import festivalkampung from "../../../image/festivalkampung.jpeg";
import hariibu from "../../../image/hariibu.png";
import harikartini from "../../../image/harikartini.png";
import kupatan from "../../../image/kupatan.png";
import mbatik from "../../../image/mbatik.png";
import nyadran from "../../../image/nyadran.png";
import nyekar from "../../../image/nyekar.png";
import taritopeng from "../../../image/taritopeng.png";

type EventItem = {
  id: number;
  name: string;
  image: string;
  date: string;
  dateOrder: number;
  description: string;
  capacity: string;
  price: string;
};

function dateOrderToInput(dateOrder: number) {
  const month = Math.floor(dateOrder / 100);
  const day = dateOrder % 100;
  return `${new Date().getFullYear()}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function isValidCalendarDate(dateOrder: number) {
  const month = Math.floor(dateOrder / 100);
  const day = dateOrder % 100;
  return month >= 1 && month <= 12 && day >= 1 && day <= new Date(2000, month, 0).getDate();
}

function parseEventDate(value: string) {
  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (isoDate) {
    const parsed = new Date(`${value}T00:00:00`);
    return {
      date: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long" }).format(parsed),
      dateOrder: (parsed.getMonth() + 1) * 100 + parsed.getDate(),
    };
  }

  const textDate = /^(\d{1,2})\s+([a-zA-Z]+)$/.exec(value.trim());
  const month = MONTHS_ID.findIndex((name) => name.toLowerCase() === textDate?.[2]?.toLowerCase()) + 1;
  const day = Number(textDate?.[1]);
  if (!textDate || month < 1 || day < 1 || day > 31) return null;
  return { date: `${day} ${MONTHS_ID[month - 1]}`, dateOrder: month * 100 + day };
}

const NEAR_EVENT: EventItem = {
  id: 1,
  name: "Tari Topeng",
  image: taritopeng.src,
  date: "25 Oktober",
  dateOrder: 1025,
  description:
    "Nikmati pertunjukan tari topeng khas Malang yang menghidupkan kisah dan tradisi Kampung Budaya Polowijen.",
  capacity: "120 Kursi",
  price: "Rp. 50.000 / Orang",
};

const PAST_EVENTS: EventItem[] = [
  {
    id: 2,
    name: "Festival Batik Polowijen",
    image: mbatik.src,
    date: "5 Oktober",
    dateOrder: 1005,
    description:
      "Perayaan karya batik lokal, pertunjukan seni, dan kreativitas warga Polowijen.",
    capacity: "120 Kursi",
    price: "Rp. 50.000 / Orang",
  },
  {
    id: 3,
    name: "Megengan & Nyadran",
    image: nyadran.src,
    date: "31 Februari",
    dateOrder: 231,
    description:
      "Tradisi kebersamaan warga untuk menyambut bulan suci dengan doa dan sajian budaya.",
    capacity: "120 Kursi",
    price: "Rp. 50.000 / Orang",
  },
  {
    id: 4,
    name: "Festival Kampung Budaya Polowijen",
    image: festivalkampung.src,
    date: "18 April",
    dateOrder: 418,
    description:
      "Perayaan budaya yang menampilkan tradisi, seni, dan karya warga Kampung Budaya Polowijen.",
    capacity: "120 Kursi",
    price: "Rp. 50.000 / Orang",
  },
  {
    id: 5,
    name: "Riyoyo Kupatan",
    image: kupatan.src,
    date: "19 April",
    dateOrder: 419,
    description:
      "Perayaan kupatan yang mempererat kebersamaan melalui tradisi dan sajian khas warga.",
    capacity: "120 Kursi",
    price: "Rp. 50.000 / Orang",
  },
  {
    id: 6,
    name: "Peringatan Hari Kartini",
    image: harikartini.src,
    date: "20 April",
    dateOrder: 420,
    description:
      "Peringatan Hari Kartini untuk mengenang semangat dan perjuangan perempuan Indonesia.",
    capacity: "120 Kursi",
    price: "Rp. 50.000 / Orang",
  },
  {
    id: 7,
    name: "Nyekar Topeng Malang",
    image: nyekar.src,
    date: "19 Juli",
    dateOrder: 719,
    description:
      "Tradisi nyekar untuk menghormati para leluhur dan tokoh pelestari Topeng Malang.",
    capacity: "120 Kursi",
    price: "Rp. 50.000 / Orang",
  },
  {
    id: 8,
    name: "Peringatan Hari Ibu",
    image: hariibu.src,
    date: "21 Desember",
    dateOrder: 1221,
    description:
      "Peringatan Hari Ibu sebagai bentuk penghargaan atas kasih dan peran para ibu.",
    capacity: "120 Kursi",
    price: "Rp. 50.000 / Orang",
  },
];

export default function AdminEventsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [nearEvent, setNearEvent] = useState<EventItem | null>(NEAR_EVENT);
  const [events, setEvents] = useState<EventItem[]>(PAST_EVENTS);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<EventItem | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [form, setForm] = useState({ name: "", date: "", description: "", capacity: "", price: "", image: "" });

  function handleImageUpload(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Pilih file gambar yang valid.");
      return;
    }
    setUploadError("");
    setForm((current) => ({ ...current, image: URL.createObjectURL(file) }));
  }

  function openCreateForm() {
    setEditingEvent(null);
    setForm({ name: "", date: "", description: "", capacity: "", price: "", image: "" });
    setUploadError("");
    setIsFormOpen(true);
  }

  function openEditForm(item: EventItem) {
    setEditingEvent(item);
    setForm({
      name: item.name,
      date: isValidCalendarDate(item.dateOrder) ? dateOrderToInput(item.dateOrder) : item.date,
      description: item.description,
      capacity: item.capacity,
      price: item.price,
      image: item.image,
    });
    setUploadError("");
    setIsFormOpen(true);
  }

  function saveEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.date) return;
    const parsedDate = parseEventDate(form.date);
    if (!parsedDate) return;
    const savedEvent: EventItem = {
      id: editingEvent?.id ?? Date.now(),
      ...form,
      name: form.name.trim(),
      date: parsedDate.date,
      dateOrder: parsedDate.dateOrder,
      description: form.description.trim() || "Informasi kegiatan akan segera diperbarui.",
      image: form.image.trim() || taritopeng.src,
    };
    if (editingEvent) {
      if (nearEvent?.id === editingEvent.id) {
        setNearEvent(savedEvent);
      } else {
        setEvents((items) => items.map((item) => item.id === savedEvent.id ? savedEvent : item));
      }
    } else {
      setEvents((items) => [...items, savedEvent]);
    }
    setForm({ name: "", date: "", description: "", capacity: "", price: "", image: "" });
    setEditingEvent(null);
    setUploadError("");
    setIsFormOpen(false);
  }

  function deleteEvent() {
    if (!pendingDelete) return;
    if (nearEvent?.id === pendingDelete.id) {
      setNearEvent(null);
    } else {
      setEvents((items) => items.filter((item) => item.id !== pendingDelete.id));
    }
    setPendingDelete(null);
  }

  const historyEvents = [...events].sort((first, second) => first.dateOrder - second.dateOrder);

  return (
    <>
      <Head>
        <title>Event | Kampung Budaya Polowijen</title>
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="event-app">
        <AdminSidebar activeRoute="events" />

        <main className="event-main">
          <section aria-labelledby="upcoming-heading">
            <div className="section-heading-row">
              <h1 id="upcoming-heading" className="section-title">Event Terdekat:</h1>
              <button className="add-event" onClick={openCreateForm} title="Tambah event">
                <Plus size={18} aria-hidden="true" />
                <span>Tambah event</span>
              </button>
            </div>
            {nearEvent && <article className="featured-event">
              <CardActions onEdit={() => openEditForm(nearEvent)} onDelete={() => setPendingDelete(nearEvent)} />
              <div className="featured-heading">
                <h2>{nearEvent.name}</h2>
                <p className="event-date"><CalendarDays size={14} aria-hidden="true" /> {nearEvent.date}</p>
              </div>
              <div className="featured-content">
                <div className="featured-image-frame">
                  <Image className="featured-image" src={nearEvent.image} alt={nearEvent.name} width={800} height={500} unoptimized loading="eager" />
                </div>
                <div className="event-description">
                  <h3>Tentang Kegiatan</h3>
                  <p>{nearEvent.description}</p>
                  <div className="featured-stats">
                    <Info label="Kuota" value={nearEvent.capacity} />
                    <Info label="Harga Tiket" value={nearEvent.price} />
                  </div>
                </div>
              </div>
            </article>}
          </section>

          <section className="history-section" aria-labelledby="history-heading">
            <h2 id="history-heading" className="section-title history-title">Riwayat Event:</h2>
            <div className="history-list">
              {historyEvents.map((event, index) => (
                <article className="history-card" key={event.id} style={{ animationDelay: `${index * 80}ms` }}>
                  <CardActions className="history-card-actions" onEdit={() => openEditForm(event)} onDelete={() => setPendingDelete(event)} />
                  <div className="history-image-frame">
                    <Image className="history-image" src={event.image} alt={event.name} width={500} height={350} unoptimized />
                  </div>
                  <div className="history-copy">
                    <h3>{event.name}</h3>
                    <p className="history-caption event-date"><CalendarDays size={13} aria-hidden="true" /> {event.date}</p>
                    <h4>Tentang Kegiatan</h4>
                    <p className="history-description">{event.description}</p>
                  </div>
                  <div className="history-stats">
                    <Info label="Kuota" value={event.capacity} />
                    <Info label="Harga Tiket" value={event.price} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>

      {isFormOpen && (
        <div className="event-overlay" onMouseDown={(e) => e.target === e.currentTarget && setIsFormOpen(false)}>
          <form className="event-dialog" role="dialog" aria-modal="true" aria-labelledby="event-dialog-title" onSubmit={saveEvent}>
            <div className="dialog-heading">
              <h2 id="event-dialog-title">{editingEvent ? "Edit Event" : "Tambah Event"}</h2>
              <button type="button" className="close-dialog" onClick={() => setIsFormOpen(false)} aria-label="Tutup">
                <X size={20} />
              </button>
            </div>
            <label>Nama event<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label>Tanggal kegiatan<input type={editingEvent && !isValidCalendarDate(editingEvent.dateOrder) ? "text" : "date"} placeholder="contoh: 31 Februari" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
            <label>Tentang kegiatan<textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <label>{form.image ? "Gambar telah ter-upload" : "Unggah gambar"}<input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.currentTarget.files?.[0])} /></label>
            {uploadError && <p className="upload-error" role="alert">{uploadError}</p>}
            {form.image && <Image className="upload-preview" src={form.image} alt="Pratinjau gambar event" width={460} height={190} unoptimized />}
            <div className="form-row">
              <label>Kuota<input value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></label>
              <label>Harga tiket<input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
            </div>
            <button type="submit" className="save-event">{editingEvent ? "Simpan perubahan" : "Simpan event"}</button>
          </form>
        </div>
      )}

      {pendingDelete && (
        <div className="event-overlay" onMouseDown={(e) => e.target === e.currentTarget && setPendingDelete(null)}>
          <div className="event-dialog delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title">
            <h2 id="delete-dialog-title">Hapus event?</h2>
            <p>Event “{pendingDelete.name}” akan dihapus dari daftar.</p>
            <div className="delete-actions">
              <button type="button" className="cancel-delete" onClick={() => setPendingDelete(null)}>Batal</button>
              <button type="button" className="confirm-delete" onClick={deleteEvent}>Hapus</button>
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
          /* Zoom foto untuk memotong margin/shadow bawaan PNG. 1 = tanpa zoom */
          --img-crop:1.12;
        }
        body { margin:0; background:var(--event-cream); color:var(--event-ink); font:400 14px/1.55 Poppins, sans-serif; }
        *,*::before,*::after { box-sizing:border-box; }
        .event-info { display:flex; flex-direction:column; }
        .event-info span { color:#9d8978; font-size:9px; line-height:1.45; }
        .event-info strong { color:#48291d; font-size:10px; line-height:1.45; font-weight:500; }
        @keyframes event-rise { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        @keyframes event-fade { from { opacity:0; } to { opacity:1; } }
      `}</style>
      <style jsx>{`
        .event-app { min-height:100vh; display:flex; }
        .event-main { min-width:0; flex:1; padding:31px 32px 40px; }
        .section-heading-row { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:24px; }
        .section-heading-row .section-title { margin-bottom:0; }
        .section-title { margin:0 0 13px 12px; color:#563327; font-size:16px; line-height:1.4; font-weight:600; }
        .featured-event,.history-card { background:var(--event-card); border:1px solid rgba(91,71,55,.25); border-radius:19px; box-shadow:0 1px 8px rgba(31,24,18,.42); transition:translate .28s ease,box-shadow .28s ease,border-color .28s ease; }
        .featured-event,.history-card { animation:event-rise .55s cubic-bezier(.2,.7,.2,1) both; }
        .featured-event:hover,.history-card:hover { translate:0 -4px; border-color:rgba(200,132,36,.55); box-shadow:0 10px 24px rgba(31,24,18,.16); }
        .featured-event { position:relative; min-height:286px; padding:17px 21px 20px; }
        .featured-heading { margin:0 0 15px; padding-right:86px; }
        .featured-heading h2,.history-copy h3 { margin:0; color:#111; font-size:17px; line-height:1.35; font-weight:700; }
        .featured-heading p,.history-caption { margin:3px 0 0; color:#62534a; font-size:9px; line-height:1.5; }
        .event-date { width:fit-content; display:flex; align-items:center; gap:6px; padding:5px 9px; border-radius:999px; background:#f3e7d3; color:#7e4b1e; font-size:10px; font-weight:600; }
        .featured-heading .event-date { margin-top:8px; }
        .featured-content { display:grid; grid-template-columns:minmax(210px,36%) minmax(190px,1fr) 44px; align-items:center; gap:20px; }

        /* ===== FOTO: frame memotong sudut, gambar di-zoom untuk buang margin PNG ===== */
        .featured-image-frame { width:100%; height:188px; overflow:hidden; border-radius:17px; box-shadow:0 2px 8px rgba(0,0,0,.5); }
        :global(.featured-image) { display:block; width:100%; height:100%; object-fit:cover; object-position:center 20%; transform:scale(var(--img-crop)); transform-origin:center top; transition:transform .55s cubic-bezier(.2,.7,.2,1); }
        .featured-event:hover :global(.featured-image) { transform:scale(calc(var(--img-crop) + .04)); }
        .history-image-frame { width:100%; height:156px; overflow:hidden; border-radius:17px; box-shadow:0 2px 8px rgba(0,0,0,.5); }
        :global(.history-image) { display:block; width:100%; height:100%; object-fit:cover; object-position:center 20%; transform:scale(var(--img-crop)); transition:transform .55s cubic-bezier(.2,.7,.2,1); }
        .history-card:hover :global(.history-image) { transform:scale(calc(var(--img-crop) + .04)); }

        .event-description { align-self:stretch; padding-top:0; max-width:310px; }
        .event-description h3,.history-copy h4 { margin:0 0 10px; font-size:11px; line-height:1.4; font-weight:600; }
        .event-description > p,.history-description { margin:0; color:#51443c; font-size:9px; line-height:1.55; }
        .featured-stats { display:flex; flex-direction:column; gap:12px; margin-top:14px; }
        .add-event { min-height:40px; display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:0 14px; border:0; border-radius:8px; background:var(--event-brown); color:#fff8ec; box-shadow:0 2px 7px rgba(31,24,18,.18); font:500 12px Poppins,sans-serif; cursor:pointer; transition:transform .2s,box-shadow .2s,background .2s; }
        .add-event:hover { transform:translateY(-2px); background:#623b2b; box-shadow:0 5px 11px rgba(0,0,0,.2); }
        :global(.card-actions) { display:flex; align-items:center; gap:6px; }
        :global(.card-actions button) { width:32px; height:32px; display:grid; place-items:center; padding:0; border:1px solid #d8cbb9; border-radius:7px; background:#fffaf1; color:#563327; cursor:pointer; transition:background .18s,color .18s,transform .18s; }
        :global(.card-actions button:hover) { transform:translateY(-1px); background:#f3e7d3; color:#8d3b28; }
        .featured-event :global(.card-actions) { position:absolute; top:15px; right:16px; }
        .history-section { margin-top:20px; }
        .history-title { margin-bottom:13px; }
        .history-list { display:flex; flex-direction:column; gap:21px; }
        .history-card { min-height:210px; display:grid; grid-template-columns:minmax(175px,28%) minmax(0,1fr) 155px; grid-template-rows:auto 1fr; align-items:center; gap:12px 24px; padding:14px 20px 18px; }
        :global(.history-card-actions) { grid-column:1 / -1; justify-self:end; margin-bottom:-8px; }
        .history-copy { min-width:0; align-self:center; }
        .history-copy h3 { font-size:16px; }
        .history-caption { margin:4px 0 12px; }
        .history-copy .event-date { margin:7px 0 12px; }
        .history-copy h4 { margin-bottom:8px; font-size:10px; }
        .history-description { max-width:390px; }
        .history-stats { min-height:108px; display:flex; flex-direction:column; justify-content:center; gap:10px; padding:15px 20px; border:1px solid #d2c5b4; border-radius:17px; background:var(--event-cream); box-shadow:0 1px 5px rgba(0,0,0,.22); }
        .event-overlay { position:fixed; inset:0; z-index:30; display:grid; place-items:center; padding:18px; background:rgba(35,22,16,.56); animation:event-fade .2s ease both; }
        .event-dialog { width:min(460px,100%); padding:23px; border-radius:14px; background:var(--event-cream); box-shadow:0 14px 45px rgba(0,0,0,.24); }
        .delete-dialog h2 { margin:0; color:var(--event-brown); font-size:20px; font-weight:600; }
        .delete-dialog p { margin:12px 0 20px; color:var(--event-muted); font-size:13px; }
        .delete-actions { display:flex; justify-content:flex-end; gap:9px; }
        .delete-actions button { min-height:38px; padding:0 14px; border-radius:7px; font:500 12px Poppins,sans-serif; cursor:pointer; }
        .cancel-delete { border:1px solid #d9c9b6; background:transparent; color:var(--event-brown); }
        .confirm-delete { border:1px solid #a33a2d; background:#a33a2d; color:#fff; }
        .dialog-heading { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
        .dialog-heading h2 { margin:0; color:var(--event-brown); font-size:20px; font-weight:600; }
        .close-dialog { display:grid; place-items:center; padding:5px; border:0; background:transparent; color:var(--event-brown); cursor:pointer; }
        .event-dialog label { display:block; margin:12px 0 0; color:var(--event-brown); font-size:12px; font-weight:500; }
        .event-dialog input,.event-dialog textarea { width:100%; margin-top:5px; padding:9px 10px; border:1px solid #d9c9b6; border-radius:7px; background:#fffdf9; color:var(--event-ink); font:400 13px Poppins,sans-serif; }
        .event-dialog input[type=file] { padding:7px; }
        .event-dialog input[type=file]::file-selector-button { margin-right:10px; padding:6px 10px; border:0; border-radius:5px; background:#f3e7d3; color:var(--event-brown); font:500 12px Poppins,sans-serif; cursor:pointer; }
        .event-dialog textarea { resize:vertical; }
        .event-dialog input:focus,.event-dialog textarea:focus { outline:2px solid #c88424; outline-offset:1px; }
        .upload-error { margin:7px 0 0; color:#b3261e; font-size:12px; }
        :global(.upload-preview) { display:block; width:100%; height:150px; margin-top:9px; object-fit:cover; border-radius:8px; }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .save-event { width:100%; margin-top:20px; padding:10px; border:0; border-radius:7px; background:var(--event-brown); color:white; font:500 13px Poppins,sans-serif; cursor:pointer; }
        @media (min-width:1200px) { .event-main { padding-right:38px; padding-left:28px; } }
        @media (max-width:850px) {
          .event-main { padding:26px 20px 36px; }
          .featured-content { grid-template-columns:minmax(170px,35%) minmax(0,1fr) 38px; gap:15px; }
          .history-card { grid-template-columns:minmax(140px,25%) minmax(0,1fr) 135px; gap:16px; padding:14px; }
          .history-stats { padding:12px 16px; }
        }
        @media (max-width:650px) {
          .event-app { display:block; }
          .event-main { padding:24px 16px 36px; }
          .section-title { margin-left:2px; }
          .featured-event { min-height:0; padding:16px; }
          .featured-content { grid-template-columns:minmax(0,42%) minmax(0,1fr); align-items:start; gap:15px; }
          .featured-image-frame { height:166px; }
          .event-description { padding:0; }
          .event-description h3 { margin-bottom:6px; }
          .featured-stats { margin-top:8px; gap:5px; }
          .history-section { margin-top:22px; }
          .history-list { gap:14px; }
          .history-card { grid-template-columns:130px minmax(0,1fr); gap:14px; padding:14px; }
          .history-image-frame { height:122px; }
          .history-stats { grid-column:2; min-height:unset; display:flex; flex-direction:row; justify-content:flex-start; gap:20px; padding:8px 10px; border-radius:10px; }
          .history-copy h3 { font-size:14px; }
          .history-caption { margin-bottom:9px; }
          .history-copy h4 { margin-bottom:4px; }
        }
        @media (max-width:420px) {
          .event-main { padding-right:12px; padding-left:12px; }
          .featured-content { grid-template-columns:1fr; }
          .featured-image-frame { height:200px; }
          .event-description { padding-bottom:35px; }
          .history-card { grid-template-columns:108px minmax(0,1fr); gap:12px; padding:12px; }
          .history-image-frame { height:108px; border-radius:12px; }
          .history-stats { gap:12px; }
        }
        @media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation-duration:.01ms !important; transition-duration:.01ms !important; } }
      `}</style>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="event-info"><span>{label}</span><strong>{value}</strong></div>;
}

function CardActions({
  className = "",
  onEdit,
  onDelete,
}: {
  className?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={`card-actions ${className}`}>
      <button type="button" onClick={onEdit} aria-label="Edit event" title="Edit event">
        <Pencil size={15} aria-hidden="true" />
      </button>
      <button type="button" onClick={onDelete} aria-label="Hapus event" title="Hapus event">
        <Trash2 size={15} aria-hidden="true" />
      </button>
    </div>
  );
}