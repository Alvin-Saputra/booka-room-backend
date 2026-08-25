# Panduan Implementasi Drizzle ORM (MySQL)

Berdasarkan pengecekan pada `package.json`, proyek Anda menggunakan `mysql2` sebagai driver database dan menggunakan ES Modules (`"type": "module"`). Berikut adalah langkah-langkah untuk mengimplementasikan Drizzle ORM sesuai dengan ERD yang Anda berikan.

## 1. Install Dependensi Drizzle

Buka terminal dan jalankan perintah berikut di root folder backend Anda:

```bash
# Install core Drizzle ORM
npm install drizzle-orm

# Install Drizzle Kit untuk keperluan migrasi (sebagai dev dependency)
npm install -D drizzle-kit
```

## 2. Buat Skema Database (`src/schema.js`)

Berdasarkan ERD, kita memiliki 3 tabel: `users`, `rooms`, dan `bookings`. Buat file baru di `src/schema.js` dan tambahkan kode berikut:

```javascript
import { mysqlTable, serial, varchar, int, timestamp } from "drizzle-orm/mysql-core";

// Tabel Users
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  user_code: varchar('user_code', { length: 255 }),
  user_name: varchar('user_name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  password: varchar('password', { length: 255 }),
  role: varchar('role', { length: 50 }),
});

// Tabel Rooms
export const rooms = mysqlTable('rooms', {
  id: serial('id').primaryKey(),
  room_code: varchar('room_code', { length: 255 }),
  room_name: varchar('room_name', { length: 255 }),
  capacity: int('capacity'),
});

// Tabel Bookings
export const bookings = mysqlTable('bookings', {
  id: serial('id').primaryKey(),
  id_user: int('id_user').references(() => users.id),
  id_room: int('id_room').references(() => rooms.id),
  start_time: timestamp('start_time'),
  end_time: timestamp('end_time'),
  purpose: varchar('purpose', { length: 255 }),
  status: varchar('status', { length: 50 }),
  booked_at: timestamp('booked_at').defaultNow(),
});
```

## 3. Konfigurasi Koneksi Database (`src/db.js`)

Buat file baru di `src/db.js` untuk mengatur koneksi database menggunakan pool koneksi dari `mysql2`:

```javascript
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import 'dotenv/config'; // Pastikan Anda sudah menginstall dotenv

// Pastikan DATABASE_URL ada di file .env Anda
// Format: mysql://user:password@host:port/database_name
const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

export const db = drizzle(poolConnection);
```

## 4. Konfigurasi Drizzle Kit (`drizzle.config.js`)

Buat file konfigurasi untuk Drizzle Kit di **root direktori** proyek Anda dengan nama `drizzle.config.js`:

```javascript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.js',
  out: './drizzle', // Folder tempat file migrasi akan disimpan
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
```

## 5. Sinkronisasi Skema ke Database

Pastikan Anda memiliki variabel `DATABASE_URL` di file `.env` Anda. Contoh:
```env
DATABASE_URL=mysql://root:password_anda@localhost:3306/nama_database_anda
```

Setelah konfigurasi selesai, Anda bisa mensinkronkan skema ini ke database dengan menjalankan perintah berikut di terminal:

```bash
# Untuk langsung mengaplikasikan skema ke database (push)
npx drizzle-kit push
```

Atau, jika Anda ingin menggunakan sistem migrasi bertahap (disarankan untuk production):
```bash
# 1. Generate file SQL migrasi
npx drizzle-kit generate

# 2. Terapkan file SQL tersebut ke database
npx drizzle-kit migrate
```

## Tips Penggunaan Query
Setelah implementasi selesai, Anda bisa melakukan query di file mana saja (contoh di controller) seperti ini:

```javascript
import { db } from './db.js';
import { users } from './schema.js';

// Contoh mengambil semua data users
const allUsers = await db.select().from(users);
```

Silakan ikuti panduan di atas. Jika ada error atau kendala saat menerapkannya, beri tahu saya!
