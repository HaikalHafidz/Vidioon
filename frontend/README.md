# 🎬 VIDIOON — Website Streaming Gratis

> Nonton film, serial, dan anime favorit kamu secara gratis. Tanpa langganan, tanpa batas.

---

## 📁 Struktur Proyek

```
vidioon/
├── frontend/           ← Semua halaman website
│   ├── index.html      ← Halaman utama (seperti Netflix)
│   ├── watch.html      ← Halaman nonton video
│   ├── movies.html     ← Daftar semua film
│   ├── series.html     ← Daftar serial TV
│   ├── anime.html      ← Daftar anime
│   ├── login.html      ← Login & register
│   ├── style.css       ← Semua styling
│   └── app.js          ← Logika frontend
│
├── backend/            ← Server API
│   ├── server.js       ← Server utama Node.js
│   ├── package.json    ← Dependensi npm
│   ├── db.json         ← Database (auto-dibuat)
│   └── uploads/        ← Folder upload gambar
│
└── admin/
    └── admin.html      ← Panel admin lengkap
```

---

## 🚀 CARA MENJALANKAN

### Langkah 1 — Install Node.js
Download dari: https://nodejs.org (pilih versi LTS)

### Langkah 2 — Install dependensi backend
```bash
cd vidioon/backend
npm install
```

### Langkah 2.5 — Konfigurasi rahasia
Salin `backend/.env.example` menjadi `backend/.env` dan isi:
```env
JWT_SECRET=your-strong-random-secret-here
FRONTEND_URL=http://localhost:5500
```

### Langkah 3 — Jalankan server backend
```bash
npm start
# atau untuk development (auto-reload):
npm run dev
```
Server berjalan di: http://localhost:3000

### Langkah 4 — Buka website frontend
Cara paling mudah — install ekstensi **Live Server** di VS Code, lalu klik kanan `index.html` → "Open with Live Server"

**Atau** buka langsung file `index.html` di browser (beberapa fitur API tidak akan bekerja tanpa server).

---

## 👑 LOGIN ADMIN

| Field | Value |
|-------|-------|
| URL Admin | `admin/admin.html` |
| Email | `admin@vidioon.com` |
| Password | `admin123` |

> ⚠️ **WAJIB** ganti password admin setelah pertama kali login!

---

## ➕ CARA MENAMBAHKAN FILM (PANDUAN ADMIN)

### Via Panel Admin (Direkomendasikan)

1. Buka `admin/admin.html`
2. Login dengan akun admin
3. Klik menu **"Tambah Konten"** di sidebar
4. Pilih tipe: **Film**, **Serial TV**, atau **Anime**
5. Isi form:
   - **Judul** — Nama film/serial
   - **Tahun** — Tahun rilis
   - **Genre** — Pilih dari dropdown
   - **Sinopsis** — Cerita singkat
   - **URL Poster** — Link gambar poster (format 2:3)
   - **URL Backdrop** — Link gambar latar (format 16:9)
   - **Embed Server 1** — Link embed video utama
6. Klik **"Simpan Konten"**

### Mendapatkan Link Embed Video

#### Untuk Film (gunakan TMDB ID):
```
https://www.2embed.cc/embed/{TMDB_ID}
https://vidsrc.to/embed/movie/{TMDB_ID}
https://multiembed.mov/?video_id={TMDB_ID}&tmdb=1
```

#### Untuk Serial TV:
```
https://www.2embed.cc/embedtv/{TMDB_ID}
https://vidsrc.to/embed/tv/{TMDB_ID}
```

#### Cara cari TMDB ID:
1. Buka https://www.themoviedb.org
2. Cari film/serial
3. Lihat angka di URL: `themoviedb.org/movie/**693134**-dune-part-two`
4. Angka **693134** = TMDB ID

#### Contoh:
- Dune 2: `https://www.2embed.cc/embed/693134`
- Oppenheimer: `https://www.2embed.cc/embed/872585`
- Breaking Bad: `https://www.2embed.cc/embedtv/1396`

### Via API (untuk developer)
```bash
curl -X POST http://localhost:3000/api/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Nama Film",
    "year": 2024,
    "genre": "Aksi",
    "desc": "Sinopsis film...",
    "type": "movie",
    "poster": "https://url-gambar-poster.jpg",
    "backdrop": "https://url-gambar-backdrop.jpg",
    "embed": "https://www.2embed.cc/embed/123456",
    "rating": 8.5,
    "duration": "2j 15m"
  }'
```

---

## 🔌 API ENDPOINT LENGKAP

### Auth
| Method | URL | Keterangan |
|--------|-----|------------|
| POST | `/api/auth/register` | Daftar akun baru |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Info user (perlu login) |

### Konten
| Method | URL | Keterangan |
|--------|-----|------------|
| GET | `/api/content` | Semua konten |
| GET | `/api/content?type=movie` | Filter berdasarkan tipe |
| GET | `/api/content?genre=Aksi` | Filter berdasarkan genre |
| GET | `/api/content?search=dune` | Pencarian |
| GET | `/api/content/trending` | Konten trending |
| GET | `/api/content/top10` | Top 10 berdasarkan rating |
| GET | `/api/content/:id` | Detail konten |
| POST | `/api/content` | Tambah konten (admin) |
| PUT | `/api/content/:id` | Edit konten (admin) |
| DELETE | `/api/content/:id` | Hapus konten (admin) |

### Wishlist
| Method | URL | Keterangan |
|--------|-----|------------|
| GET | `/api/wishlist` | Daftar saya |
| POST | `/api/wishlist/:id` | Tambah ke daftar |
| DELETE | `/api/wishlist/:id` | Hapus dari daftar |

### Admin
| Method | URL | Keterangan |
|--------|-----|------------|
| GET | `/api/admin/stats` | Statistik website |
| GET | `/api/admin/users` | Daftar semua user |
| POST | `/api/upload` | Upload gambar |

---

## 🌐 FITUR WEBSITE

### Halaman Utama (index.html)
- ✅ Hero banner besar dengan animasi
- ✅ Baris konten yang bisa di-scroll horizontal (seperti Netflix)
- ✅ Trending Now, Film Terbaru, Serial Populer, Anime
- ✅ Top 10 Indonesia
- ✅ Pencarian real-time
- ✅ Modal info sebelum nonton
- ✅ Navbar responsif untuk mobile

### Halaman Nonton (watch.html)
- ✅ Video player embed (iframe)
- ✅ Multiple server streaming (Server 1, 2, 3)
- ✅ Info film lengkap
- ✅ Konten terkait / rekomendasi

### Panel Admin (admin/admin.html)
- ✅ Dashboard dengan statistik
- ✅ Form tambah konten lengkap
- ✅ Preview poster realtime
- ✅ Kelola semua film/serial/anime
- ✅ Edit & hapus konten
- ✅ Kelola pengguna

---

## 🎨 KUSTOMISASI TAMPILAN

Edit file `frontend/style.css` bagian `:root`:

```css
:root {
  --bg: #0a0a0f;        /* Warna background utama */
  --accent: #e50914;    /* Warna aksen (merah Netflix) */
  --accent2: #ff6b35;   /* Warna aksen kedua */
  --gold: #f5c518;      /* Warna rating bintang */
}
```

Ganti `--accent: #e50914` dengan warna favoritmu:
- Biru: `#0066ff`
- Ungu: `#8b5cf6`
- Hijau: `#10b981`

---

## 🚀 DEPLOY KE INTERNET

### Cara Paling Mudah — Railway.app (Gratis)
1. Daftar di https://railway.app
2. Buat project baru
3. Upload folder `backend/`
4. Railway akan otomatis jalankan `npm start`
5. Copy URL yang diberikan Railway
6. Ubah `API_BASE` di `frontend/app.js` ke URL Railway

### Frontend — Netlify atau Vercel (Gratis)
1. Daftar di https://netlify.com
2. Drag & drop folder `frontend/`
3. Website langsung online!

### Database Produksi — Ganti ke MongoDB
Install: `npm install mongoose`
Ubah fungsi `readDB()` dan `writeDB()` di `server.js` ke MongoDB.

---

## ⚠️ CATATAN PENTING

1. **Hak Cipta**: Pastikan konten yang ditambahkan tidak melanggar hak cipta. Gunakan konten yang bebas hak cipta atau milik sendiri.
2. **DMCA**: Tambahkan halaman DMCA dan email kontak untuk menerima laporan pelanggaran.
3. **Server Embed**: Layanan embed seperti 2embed.cc dapat berubah sewaktu-waktu. Selalu sediakan multiple server.
4. **Database**: File `db.json` adalah database sederhana. Untuk produksi, gunakan MongoDB atau PostgreSQL.

---

## 💬 BANTUAN

Jika ada masalah:
1. Cek apakah Node.js sudah terinstall: `node --version`
2. Cek apakah backend berjalan: buka http://localhost:3000
3. Cek console browser untuk error (F12 → Console)

---

*Dibuat dengan ❤️ untuk semua pecinta film Indonesia*