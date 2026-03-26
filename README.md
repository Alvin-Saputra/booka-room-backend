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




