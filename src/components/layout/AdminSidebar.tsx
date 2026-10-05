import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logok from "../../../image/logok.png";

const ITEMS = [
  ["Dashboard", "dashboard"],
  ["Umkm", "umkm"],
  ["Event", "events"],
  ["Paket Kunjungan", "paket"],
  ["Data User", "users"],
];

export default function AdminSidebar({ activeRoute }: { activeRoute: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

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
          {ITEMS.map(([label, route]) => (
            <Link key={route} href={`/admin/${route}`} className={route === activeRoute ? "active" : ""} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {menuOpen && <button type="button" className="admin-sidebar-scrim" aria-label="Tutup menu" onClick={() => setMenuOpen(false)} />}

      <style jsx>{`
        .admin-mobile-topbar { display:none; }
        .admin-sidebar { position:sticky; top:0; z-index:10; width:234px; height:100vh; min-height:100vh; flex:0 0 234px; align-self:flex-start; padding:30px 0; overflow-y:auto; background:#4a2a1f; }
        .admin-sidebar :global(.brand-mark) { width:100%; height:103px; margin:0 auto 25px; display:flex; justify-content:center; align-items:flex-start; }
        .admin-sidebar :global(.brand-mark img) { width:49px; height:72px; object-fit:contain; }
        .admin-sidebar nav { display:flex; flex-direction:column; gap:13px; }
        .admin-sidebar nav :global(a) { min-height:47px; display:flex; align-items:center; justify-content:center; margin-left:34px; padding:8px 12px; color:#fff8ec; text-align:center; text-decoration:none; font:400 22px/1.1 "Great Vibes",cursive; transition:background .2s,color .2s; }
        .admin-sidebar nav :global(a:hover) { color:#f1cf9f; }
        .admin-sidebar nav :global(a.active) { margin-left:34px; border-radius:30px 0 0 30px; background:#fff8ec; color:#b3261e; }
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