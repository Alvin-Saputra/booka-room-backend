# Booka Room - Backend API 🏢

Repositori ini berisi *source code* untuk **Backend API** dari aplikasi **Booka Room** (Sistem Manajemen Ruang Rapat). Proyek portofolio ini dibangun menggunakan Node.js dan Express.js untuk menyediakan RESTful API yang cepat dan efisien, serta dirancang untuk terintegrasi secara mulus dengan aplikasi *frontend* berbasis Vue.js.

Sistem ini mendukung pengelolaan *user*, pengelolaan ruang rapat, hingga alur pemesanan (booking) dan *approval* ruangan, lengkap dengan sistem autentikasi dan otorisasi berbasis *Role* (Admin & User).

## 🚀 Teknologi yang Digunakan

- **Runtime:** Node.js
- **Framework:** Express.js (v5.2.1)
- **Database:** MySQL (dengan `mysql2` & *Connection Pool*)
- **Autentikasi:** JSON Web Token (JWT) & `bcryptjs` untuk enkripsi *password*
- **Utilitas Lainnya:** `cors`, `dotenv` (Environment Variables), `nodemailer` (Notifikasi Email)

## ⚙️ Prasyarat (Prerequisites)

Sebelum menjalankan aplikasi ini, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (Versi 18 atau terbaru direkomendasikan)
- [MySQL Server](https://www.mysql.com/)

## 🛠️ Cara Instalasi & Menjalankan Aplikasi Lokal

1. **Clone repository ini:**
   ```bash
   git clone [https://github.com/username-anda/booka-room-backend.git](https://github.com/username-anda/booka-room-backend.git)
   cd booka-room-backend

2. **Install Depedency:**
   ```bash
   npm install
   
3. **Atur Environment Variables:**
   ```bash
   # Konfigurasi Database
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password_database_anda
   DB_NAME=nama_database_bookaroom
   DB_PORT=3306
   
   # Konfigurasi JWT
   JWT_SECRET=rahasia_jwt_super_aman_anda
   
3. **Jalankan Server Development:**
   ```bash
   npm start

## 📌 Daftar Endpoint API Utama

Berikut adalah rangkuman struktur *route* REST API yang tersedia. Setiap *route* (kecuali `/login` dan *root*) mewajibkan penyertaan JWT Token pada *header* `Authorization: Bearer <token>`.

### 🔑 Autentikasi
- `POST /login` : Endpoint untuk *login* dan mendapatkan JWT Token.

### 👥 Users Management
- `GET /users` : Melihat semua pengguna (Admin).
- `GET /users/:id` : Melihat detail pengguna tertentu (Admin, User).
- `POST /users` : Menambahkan pengguna baru (Admin).
- `PUT /users/:id` : Memperbarui data pengguna (Admin).
- `DELETE /users/:id` : Menghapus pengguna (Admin).

### 🚪 Rooms Management
- `GET /rooms` : Melihat daftar ruang rapat yang tersedia (All Authenticated Users).
- `GET /rooms/:id` : Melihat detail spesifik satu ruangan (All Authenticated Users).
- `POST /rooms` : Menambahkan ruang rapat baru (Admin).
- `PUT /rooms/:id` : Memperbarui data ruang rapat, seperti kapasitas dan nama (Admin).
- `DELETE /rooms/:id` : Menghapus ruang rapat (Admin).

### 📅 Bookings & Approval
- `GET /bookings` : Melihat daftar semua pemesanan ruangan.
- `GET /bookings/:id` : Melihat detail spesifik dari satu pemesanan.
- `GET /bookings/user/:id` : Melihat riwayat pemesanan berdasarkan ID User (Admin, User).
- `POST /bookings` : Membuat pemesanan ruangan baru (Admin, User).
- `PUT /bookings/approval/:id` : Menyetujui/menolak (*Approve/Reject*) status pemesanan (Admin).
- `DELETE /bookings/:id` : Membatalkan/menghapus riwayat pemesanan (Admin).

---

## 📂 Struktur Folder (Project Structure)

```text
booka-room-backend/
├── src/
│   ├── config/        # Konfigurasi Database (Koneksi MySQL)
│   ├── controllers/   # Logika bisnis/Controller API (Auth, User, Room, Booking)
│   ├── middlewares/   # Middleware (Validasi JWT & Otorisasi Role)
│   ├── routes/        # Definisi Endpoint API
│   ├── utils/         # Fungsi Utilitas tambahan (seperti Send Email SMTP)
│   └── server.js      # Titik masuk utama (Entry point) konfigurasi Express app
├── .env.example       # Contoh file env
├── .gitignore         # File yang diabaikan oleh Git
├── package.json       # Manifes NPM dan daftar dependensi
└── README.md          # Dokumentasi Proyek


