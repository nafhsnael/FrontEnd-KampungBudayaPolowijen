import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!menuOpen && !logoutConfirmOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setLogoutConfirmOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [logoutConfirmOpen, menuOpen]);

  return (
    <>
      <header className="admin-mobile-topbar">
        <Link
          href="/admin/dashboard"
          className="mobile-brand"
          aria-label="Kampung Budaya Polowijen - Dashboard"
        >
          <Image src={logok} alt="" width={34} height={48} priority />
        </Link>
        <span className="mobile-title">Panel Admin</span>
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen(true)}
          aria-label="Buka menu navigasi"
          aria-expanded={menuOpen}
          aria-controls="admin-sidebar-navigation"
        >
          <Menu size={18} aria-hidden="true" />
          <span>Menu</span>
        </button>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Tutup menu navigasi"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        id="admin-sidebar-navigation"
        className={`admin-sidebar${menuOpen ? " open" : ""}`}
        aria-label="Navigasi admin"
        aria-hidden={isMobile && !menuOpen}
      >
        <div className="sidebar-brand">
          <Link href="/admin/dashboard" aria-label="Kampung Budaya Polowijen - Dashboard">
            <Image src={logok} alt="" width={49} height={72} priority />
          </Link>
          <button
            type="button"
            className="sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Tutup menu"
          >
            <X size={21} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Navigasi admin" className="sidebar-nav">
          {ITEMS.map(({ label, route, href }) => (
            <Link
              key={route}
              href={href}
              className={`nav-link${route === activeRoute ? " active" : ""}`}
              aria-current={route === activeRoute ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
              tabIndex={isMobile && !menuOpen ? -1 : undefined}
            >
              <span>{label}</span>
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
          tabIndex={isMobile && !menuOpen ? -1 : undefined}
        >
          <LogOut size={17} aria-hidden="true" />
          <span>Keluar (Logout)</span>
        </button>
      </aside>

      {logoutConfirmOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#2D1B14]/60 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLogoutConfirmOpen(false);
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
        .admin-mobile-topbar {
          display: none;
        }

        .admin-sidebar { position:sticky; top:0; z-index:50; display:flex; flex-direction:column; width:234px; height:100vh; min-height:100vh; flex:0 0 234px; align-self:flex-start; padding:30px 0; overflow-y:auto; background:#3D2018; }

        .sidebar-brand {
          display: flex;
          position: relative;
          height: 103px;
          align-items: flex-start;
          justify-content: center;
          margin: 0 auto 25px;
        }

        .sidebar-brand :global(img) {
          width: 49px;
          height: 72px;
          object-fit: contain;
        }

        .sidebar-close {
          display: none;
        }

        .sidebar-nav { display:flex; flex-direction:column; gap:13px; }
        .sidebar-nav :global(a) { display:flex; min-height:47px; align-items:center; justify-content:center; margin-left:34px; padding:8px 12px; border-radius:999px 0 0 999px; color:#fff8ec; text-align:center; text-decoration:none; font:400 24px/1.1 "Great Vibes",cursive; transition:background .2s,color .2s; }
        .sidebar-nav :global(a:hover) { color:#f1cf9f; }
        .sidebar-nav :global(a.active) { background:#FAF3E0; color:#9B3D32; }

        .logout-link {
          display: flex;
          min-height: 43px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: auto 18px 4px;
          padding: 8px 12px;
          border: 1px solid rgba(255,77,77,.38);
          border-radius: 999px;
          background: transparent;
          color: #FF7770;
          cursor: pointer;
          font: 500 12px Poppins, sans-serif;
          transition: background .2s,color .2s,border-color .2s;
        }

        .logout-link:hover { border-color:#FF4D4D; background:#FF4D4D; color:#fff; }

        .admin-sidebar-backdrop {
          display: none;
        }

        @media (max-width: 767px) {
          .admin-mobile-topbar {
            position: fixed;
            z-index: 30;
            inset: 0 0 auto;
            display: flex;
            height: 58px;
            align-items: center;
            justify-content: space-between;
            padding: 7px 16px;
            background: #3D2018;
          }

          .mobile-brand {
            display: flex;
            height: 44px;
            align-items: center;
          }

          .mobile-brand :global(img) {
            width: 30px;
            height: 44px;
            object-fit: contain;
          }

          .mobile-title { display:none; }

          .menu-toggle {
            display: inline-flex;
            min-height: 39px;
            align-items: center;
            gap: 6px;
            padding: 6px 13px;
            border: 1px solid #fff8ec;
            border-radius: 6px;
            background: transparent;
            color: #fff8ec;
            cursor: pointer;
            font: 500 12px Poppins, sans-serif;
          }

          .menu-toggle:hover { background:rgba(250,243,224,.1); }

          .admin-sidebar {
            position: fixed;
            z-index: 50;
            inset: 0 auto 0 0;
            width: min(84vw, 294px);
            height: 100dvh;
            min-height: 0;
            padding: 30px 0;
            transform: translateX(-105%);
            transition: transform 0.25s ease;
            box-shadow: 8px 0 25px rgba(0,0,0,.2);
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .sidebar-brand {
            height: 103px;
            align-items: flex-start;
            justify-content: center;
            margin: 0 auto 25px;
          }

          .sidebar-brand :global(img) {
            width: 49px;
            height: 72px;
          }

          .sidebar-close {
            position: absolute;
            top: -10px;
            right: 12px;
            display: flex;
            width: 38px;
            height: 38px;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(255,248,236,.45);
            border-radius: 999px;
            background: transparent;
            color: #fff8ec;
            cursor: pointer;
          }

          .sidebar-close:hover { background:rgba(250,243,224,.12); }
          .sidebar-nav { gap:13px; }
          .sidebar-nav :global(a) { min-height:54px; margin-left:34px; padding:10px 12px; font-size:26px; }

          .logout-link {
            min-height: 48px;
            margin: auto 18px 4px;
            font-size: 12px;
          }

          .admin-sidebar-backdrop {
            position: fixed;
            z-index: 40;
            inset: 0;
            display: block;
            border: 0;
            background: rgba(24, 17, 14, 0.42);
            cursor: default;
            backdrop-filter: blur(2px);
          }

          :global(body:has(.admin-mobile-topbar) main) { padding-top:80px !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
