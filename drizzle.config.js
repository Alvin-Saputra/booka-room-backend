import { defineConfig } from 'drizzle-kit';
import 'dotenv/config'; // Pastikan dotenv sudah terinstal untuk membaca file .env

export default defineConfig({
  schema: './src/database/schema.js',
  out: './src/database/migrations', // Folder tempat file SQL migrasi akan disimpan
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});