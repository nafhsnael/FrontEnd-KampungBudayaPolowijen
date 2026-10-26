# Kampung Budaya Polowijen

Frontend menggunakan Next.js App Router. Jalankan server pengembangan dengan:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Struktur route dan halaman

Route dikelompokkan berdasarkan area menggunakan Route Groups. Nama direktori
dalam tanda kurung seperti `(admin)` dan `(user)` hanya untuk organisasi dan
tidak menjadi bagian dari URL.

```text
app/
├── (auth)/
│   ├── login/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── LoginFormClient.tsx
│   │   │   ├── LoginSection.tsx
│   │   │   └── LoginWelcomeSection.tsx
│   │   └── page.tsx
│   └── register/
│       ├── components/
│       │   ├── RegisterForm.tsx
│       │   ├── RegisterSection.tsx
│       │   └── RegisterWelcomeSection.tsx
│       └── page.tsx
├── (admin)/
│   └── admin/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── dashboard/
│       │   ├── components/
│       │   │   ├── DashboardClient.tsx
│       │   │   ├── DashboardHeroSection.tsx
│       │   │   └── DashboardStatisticsSection.tsx
│       │   └── page.tsx
│       ├── data-user/
│       │   ├── components/
│       │   │   ├── DataUserClient.tsx
│       │   │   ├── DataUserHeaderSection.tsx
│       │   │   └── DataUserSummarySection.tsx
│       │   └── page.tsx
│       ├── events/
│       │   ├── components/
│       │   │   ├── EventsClient.tsx
│       │   │   └── EventSections.tsx
│       │   └── page.tsx
│       ├── login/
│       │   ├── components/
│       │   │   ├── AdminLoginClient.tsx
│       │   │   ├── AdminLoginFooter.tsx
│       │   │   └── AdminLoginHero.tsx
│       │   └── page.tsx
│       ├── logout/
│       │   ├── components/
│       │   │   ├── LogoutClient.tsx
│       │   │   └── LogoutStatusSection.tsx
│       │   └── page.tsx
│       ├── paket/
│       │   ├── components/
│       │   │   ├── PaketClient.tsx
│       │   │   └── PaketSections.tsx
│       │   └── page.tsx
│       ├── umkm/
│       │   ├── components/
│       │   │   ├── UmkmClient.tsx
│       │   │   └── UmkmSections.tsx
│       │   └── page.tsx
│       └── users/
│           ├── components/
│           │   ├── UsersClient.tsx
│           │   ├── UsersHeaderSection.tsx
│           │   └── UsersSummarySection.tsx
│           └── page.tsx
├── (user)/
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── components/
│   │   │   ├── DashboardHero.tsx
│   │   │   └── DashboardLinks.tsx
│   │   └── page.tsx
│   ├── favorite/
│   │   ├── components/
│   │   │   ├── FavoriteClient.tsx
│   │   │   ├── FavoriteHero.tsx
│   │   │   └── FavoriteProductsSection.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── umkm/
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CatalogHeaderSection.tsx
│   │   │   ├── ProductDetailSection.tsx
│   │   │   ├── UMKMSection.tsx
│   │   │   └── UMKMPage.tsx
│   │   ├── [id]/
│   │   │   ├── components/
│   │   │   │   ├── UmkmDetailActions.tsx
│   │   │   │   └── UmkmDetailHero.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── HomeActions.tsx
│   │   └── HomeHero.tsx
│   └── page.tsx
├── components/
│   ├── admin/AdminSidebar.tsx
│   ├── auth/RouteGuard.tsx
│   ├── layout/BottomNav.tsx
│   └── ui/ConfirmModal.tsx
├── lib/
│   └── auth/session.ts
├── services/
│   └── auth.ts
├── styles/
│   └── globals.css
├── public/
│   └── images/
├── types/
│   └── umkm.ts
├── favicon.ico
└── layout.tsx
```

URL publik adalah `/`, `/login`, `/register`, `/dashboard`, `/favorite`,
`/umkm`, dan `/umkm/[id]`. URL area admin tetap `/admin`, `/admin/dashboard`,
`/admin/data-user`, `/admin/events`, `/admin/login`, `/admin/logout`,
`/admin/paket`, `/admin/umkm`, dan `/admin/users`. Login pengguna berhasil
mengarahkan ke `/dashboard`; `/admin` mengarahkan ke `/admin/dashboard`.

Route group seperti `(auth)`, `(admin)`, dan `(user)` hanya untuk organisasi
dan tidak menjadi bagian dari URL. Komponen form login/register diletakkan di
route auth masing-masing. UI khusus route admin dan favorit pengguna berada di
folder `components/` di dalam route masing-masing; komponen lintas halaman
diletakkan di `app/components/`.
`app/layout.tsx` menangani root layout dan mengimpor CSS global dari
`styles/globals.css`. Tipe bersama disimpan di `types/`; `lib/` dan `services/`
disiapkan untuk utilitas dan integrasi layanan bersama.
Susun setiap halaman dari beberapa komponen section terpisah di folder
`components/` route tersebut, misalnya hero/header, ringkasan, daftar konten,
form, dan aksi. Contoh section lain mencakup `HomeHero`, `HomeActions`,
`DataUserHeaderSection`, `UpcomingEventSection`, `EventHistorySection`, dan
`JadwalSection`. Komponen halaman atau client menjadi pengatur state dan
menyusun section-section itu, sementara `page.tsx` memanggil komponen halaman
serta tetap menjadi tempat metadata atau pengambilan parameter route. Pertahankan
`"use client"` pada komponen yang memakai state, event handler, atau browser API.
Komponen lintas halaman tetap berada di `app/components/`.

## Autentikasi dan otorisasi

- Login memanggil endpoint backend `POST /api/auth/login` melalui
  `services/auth.ts`. Respons harus menyertakan `data.accessToken` (atau
  `accessToken`) dan role `admin`/`user` di objek respons. Login admin ditolak
  jika backend tidak mengembalikan role `admin`; login pengguna memperlakukan
  role yang tidak disertakan sebagai `user`.
- `lib/auth/session.ts` menyimpan token dan role di `localStorage` saat
  “Ingat saya” dipilih, atau di `sessionStorage` untuk sesi sementara.
- `app/(admin)/admin/layout.tsx` membatasi semua route admin selain
  `/admin/login` ke role `admin`. `app/(user)/dashboard/layout.tsx` dan
  `app/(user)/favorite/layout.tsx` membatasi route tersebut ke role `user`.
  Pengunjung tanpa sesi dialihkan ke halaman login; role yang tidak sesuai
  dialihkan ke area login/role yang sesuai.
- Logout admin membersihkan token dan role dari kedua storage.
- Guard ini adalah proteksi navigasi sisi client, bukan batas keamanan server:
  nilai Web Storage dapat diubah pengguna dan token dapat dicuri oleh XSS.
  Backend wajib memvalidasi token dan role pada setiap endpoint yang
  memerlukan autentikasi/otorisasi. Route katalog `/umkm` dan detailnya tetap
  publik.

## Gambar statis

Simpan gambar yang dipakai aplikasi di `public/images/` dan referensikan
melalui URL seperti `/images/logo.png` atau `/images/festivalkampung.jpeg`.
Jangan impor gambar dari folder di luar `public/` untuk aset statis.

## Migrasi Pages Router

Untuk mengubah halaman lama:

1. Buat direktori route di dalam `app` dari path halaman, misalnya
   `pages/admin/events.tsx` menjadi `app/admin/events/page.tsx`.
2. Pindahkan UI interaktif ke file komponen di direktori route (misalnya
   `EventsClient.tsx`) dan tambahkan `"use client"` sebagai baris pertama.
3. Ganti `next/router` dengan `next/navigation`. Letakkan metadata di route
   Server Component, bukan di `next/head`.
4. Pindahkan aset dari folder root `image/` ke `public/images/` dan ubah
   referensinya menjadi URL absolut `/images/<nama-file>`.
5. Hapus `pages/` setelah semua route dan referensinya dipindahkan.
