import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import 'dotenv/config'; // Pastikan Anda sudah menginstall dotenv

// Pastikan DATABASE_URL ada di file .env Anda
// Format: mysql://user:password@host:port/database_name
const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

export const orm = drizzle(poolConnection);