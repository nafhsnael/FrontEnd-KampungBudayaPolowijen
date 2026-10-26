import { Pencil, Plus, Trash2 } from "lucide-react";

export type PaketTab = "paket" | "jadwal";

export type JadwalItem = {
  id: number;
  hari: string;
  nama: string;
  jam: string;
  gambar: string;
  desc: string;
};

export function PaketTabsSection({
  activeTab,
  onChange,
}: {
  activeTab: PaketTab;
  onChange: (tab: PaketTab) => void;
}) {
  return (
    <nav className="tabs" role="tablist" aria-label="Jenis konten paket">
      {([["paket", "Paket Kunjungan"], ["jadwal", "Jadwal Rutin"]] as const).map(
        ([tab, label]) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "on" : ""}
            onClick={() => onChange(tab)}
          >
            {label}
          </button>
        ),
      )}
    </nav>
  );
}

export function JadwalSection({
  schedules,
  onAdd,
  onEdit,
  onDelete,
}: {
  schedules: JadwalItem[];
  onAdd: () => void;
  onEdit: (schedule: JadwalItem) => void;
  onDelete: (schedule: JadwalItem) => void;
}) {
  return (
    <section className="jadwal" aria-label="Jadwal rutin">
      {["Jumat", "Sabtu"].map((day) => (
        <section key={day} className="jgrup">
          <div className="jhead">
            <h2 className="jjudul">{day}:</h2>
            {day === "Jumat" && (
              <button type="button" className="tbh" onClick={onAdd}>
                <Plus size={16} aria-hidden="true" /> Tambah Event
              </button>
            )}
          </div>
          <div className="jlist">
            {schedules.filter((schedule) => schedule.hari === day).map((schedule, index) => (
              <article
                className="jcard"
                key={schedule.id}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="jaksi">
                  <button
                    type="button"
                    aria-label={`Edit ${schedule.nama}`}
                    onClick={() => onEdit(schedule)}
                  >
                    <Pencil size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Hapus ${schedule.nama}`}
                    onClick={() => onDelete(schedule)}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
                <div
                  className="jfoto"
                  style={{ backgroundImage: `url(${schedule.gambar})` }}
                  role="img"
                  aria-label={schedule.nama}
                />
                <div className="jcopy">
                  <h3>{schedule.nama}</h3>
                  <p className="jpill">Setiap {schedule.hari}, {schedule.jam} WIB</p>
                  <h4>Tentang Kegiatan</h4>
                  <p className="jdesc">{schedule.desc}</p>
                </div>
                <div className="jstat">
                  <div className="jinfo"><span>Hari</span><strong>{schedule.hari}</strong></div>
                  <div className="jinfo"><span>Jam</span><strong>{schedule.jam} WIB</strong></div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
