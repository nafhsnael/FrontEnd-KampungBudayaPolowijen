import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LogOut } from "lucide-react";
import logok from "../../../image/logok.png";

const ITEMS = [
  { label: "Dashboard", route: "dashboard", href: "/admin/dashboard" },
  { label: "Umkm", route: "umkm", href: "/admin/umkm" },
  { label: "Event", route: "events", href: "/admin/events" },
  { label: "Paket Kunjungan", route: "paket", href: "/admin/paket" },
  { label: "Data User", route: "users", href: "/admin/users" },
] as const;

export default function AdminSidebar({ activeRoute }: { activeRoute: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  return (
    <>
      <header className="admin-mobile-topbar">
        <Link href="/admin/dashboard" className="mobile-brand" aria-label="Kampung Budaya Polowijen">
          <Image src={logok} alt="" width={30} height={44} />
        </Link>
        <button type="button" className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen}>
          Menu
        </button>
      </header>

      <aside className={`admin-sidebar${menuOpen ? " open" : ""}`}>
        <Link href="/admin/dashboard" className="brand-mark" aria-label="Kampung Budaya Polowijen">
          <Image src={logok} alt="" width={49} height={72} />
        </Link>
        <nav aria-label="Navigasi admin">
          {ITEMS.map(({ label, route, href }) => (
            <Link
              key={route}
              href={href}
              className={route === activeRoute ? "active" : ""}
              aria-current={route === activeRoute ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            setLogoutConfirmOpen(true);
          }}
          className="logout-link"
        >
          <LogOut size={16} aria-hidden="true" />
          <span>Keluar (Logout)</span>
        </button>
      </aside>

      {menuOpen && <button type="button" className="admin-sidebar-scrim" aria-label="Tutup menu" onClick={() => setMenuOpen(false)} />}

      {logoutConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D1B14]/60 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setLogoutConfirmOpen(false);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
            aria-describedby="logout-confirm-description"
            className="w-full max-w-sm rounded-3xl border border-[#E8DDD1] bg-[#FDF8F2] p-6 text-center shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F7E8E4] text-[#FF4D4D]">
              <LogOut size={21} aria-hidden="true" />
            </div>
            <h2 id="logout-confirm-title" className="text-lg font-bold text-[#3D2018]">
              Yakin ingin logout?
            </h2>
            <p id="logout-confirm-description" className="mt-2 text-sm text-[#75685F]">
              Sesi admin akan diakhiri dan Anda akan diarahkan ke halaman login.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => setLogoutConfirmOpen(false)}
                className="rounded-full border border-[#D1C7BD] px-5 py-2.5 text-xs font-semibold text-[#6D5D53] transition hover:bg-white"
              >
                Batal
              </button>
              <Link
                href="/admin/logout"
                onClick={() => setLogoutConfirmOpen(false)}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF4D4D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#E83F3F]"
              >
                <LogOut size={14} aria-hidden="true" />
                Ya, Logout
              </Link>
            </div>
          </section>
        </div>
      )}

      <style jsx>{`
        .admin-mobile-topbar { display:none; }
        .admin-sidebar { position:sticky; top:0; z-index:10; display:flex; flex-direction:column; width:234px; height:100vh; min-height:100vh; flex:0 0 234px; align-self:flex-start; padding:30px 0; overflow-y:auto; background:#4a2a1f; }
        .admin-sidebar :global(.brand-mark) { width:100%; height:103px; margin:0 auto 25px; display:flex; justify-content:center; align-items:flex-start; }
        .admin-sidebar :global(.brand-mark img) { width:49px; height:72px; object-fit:contain; }
        .admin-sidebar nav { display:flex; flex-direction:column; gap:13px; }
        .admin-sidebar nav :global(a) { min-height:47px; display:flex; align-items:center; justify-content:center; margin-left:34px; padding:8px 12px; color:#fff8ec; text-align:center; text-decoration:none; font:400 22px/1.1 "Great Vibes",cursive; transition:background .2s,color .2s; }
        .admin-sidebar nav :global(a:hover) { color:#f1cf9f; }
        .admin-sidebar nav :global(a.active) { margin-left:34px; border-radius:999px 0 0 999px; background:#FAF3E0; color:#9B3D32; }
        .admin-sidebar :global(.logout-link) { display:flex; align-items:center; justify-content:center; gap:8px; min-height:43px; margin: auto 18px 4px; padding:8px 12px; border:1px solid rgba(255,77,77,.38); border-radius:999px; background:transparent; color:#FF7770; text-decoration:none; font:500 12px Poppins,sans-serif; cursor:pointer; transition:background .2s,color .2s,border-color .2s; }
        .admin-sidebar :global(.logout-link:hover) { border-color:#FF4D4D; background:#FF4D4D; color:#fff; }
        .admin-sidebar-scrim { display:none; }
        @media (max-width:850px) { .admin-sidebar { width:205px; flex-basis:205px; } }
        @media (max-width:650px) {
          .admin-mobile-topbar { position:sticky; top:0; z-index:11; height:58px; display:flex; align-items:center; justify-content:space-between; padding:7px 16px; background:#4a2a1f; }
          .admin-mobile-topbar :global(.mobile-brand) { height:44px; display:flex; align-items:center; }
          .admin-mobile-topbar :global(.mobile-brand img) { width:30px; height:44px; object-fit:contain; }
          .menu-toggle { padding:6px 13px; border:1px solid #fff8ec; border-radius:6px; background:transparent; color:#fff8ec; font:500 12px Poppins,sans-serif; cursor:pointer; }
          .admin-sidebar { position:fixed; inset:58px auto 0 0; width:235px; height:auto; min-height:0; transform:translateX(-105%); transition:transform .25s ease; box-shadow:8px 0 25px rgba(0,0,0,.2); }
          .admin-sidebar.open { transform:translateX(0); }
          .admin-sidebar-scrim { position:fixed; z-index:9; inset:58px 0 0; display:block; border:0; background:rgba(35,22,16,.24); }
        }
        @media (prefers-reduced-motion:reduce) { *,*::before,*::after { transition-duration:.01ms !important; } }
      `}</style>
    </>
  );
}