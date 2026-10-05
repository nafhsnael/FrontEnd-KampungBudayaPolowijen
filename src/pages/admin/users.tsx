import Head from "next/head";
import AdminSidebar from "../../components/layout/AdminSidebar";

export default function AdminUsersPage() {
  return (
    <>
      <Head>
        <title>Kelola Data User | Kampung Budaya Polowijen</title>
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="users-layout">
        <AdminSidebar activeRoute="users" />
        <main className="users-main">
          <h1>Kelola Data User</h1>
        </main>
      </div>
      <style jsx global>{`
        *,*::before,*::after { box-sizing:border-box; }
        body { margin:0; background:#fff8ec; color:#201713; font:400 14px/1.55 Poppins,sans-serif; }
      `}</style>
      <style jsx>{`
        .users-layout { min-height:100vh; display:flex; }
        .users-main { min-width:0; flex:1; padding:34px 32px; }
        .users-main h1 { margin:0; color:#4a2a1f; font-size:24px; font-weight:600; }
        @media (max-width:650px) {
          .users-layout { display:block; }
          .users-main { padding:26px 18px; }
        }
      `}</style>
    </>
  );
}