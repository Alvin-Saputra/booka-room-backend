import mysql from 'mysql2/promise';
import 'dotenv/config';

async function main() {
    console.log("Mulai mereset database...");
    
    try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        
        // Mematikan Foreign Key Checks sementara
        await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
        
        // Drop tabel sesuai urutan
        await connection.query('DROP TABLE IF EXISTS bookings;');
        await connection.query('DROP TABLE IF EXISTS rooms;');
        await connection.query('DROP TABLE IF EXISTS users;');
        await connection.query('DROP TABLE IF EXISTS __drizzle_migrations;');
        
        // Menyalakan kembali Foreign Key Checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
        
        await connection.end();
        console.log("Database berhasil di-reset (Semua tabel telah dihapus)!");
    } catch (error) {
        console.error("Gagal mereset database:", error);
    } finally {
        process.exit(0);
    }
}

main();
