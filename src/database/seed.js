import dotenv from 'dotenv';
dotenv.config();

import { orm } from "./orm.js";
import { users, rooms, bookings } from "./schema.js";
import bcrypt from "bcryptjs";

async function main() {
    console.log("Mulai menjalankan seeder...");

    try {
        const saltRound = 10;
        // Menggunakan bcryptjs sesuai dengan package.json Anda
        const hashedPassword = await bcrypt.hash("password123", saltRound);

        // 1. Seed Users
        console.log("Seeding users...");
        await orm.insert(users).values([
            {
                user_code: "U-001",
                user_name: "Admin Room",
                email: "admin@example.com",
                password: hashedPassword,
                role: "admin"
            },
            {
                user_code: "U-002",
                user_name: "Budi Santoso",
                email: "budi@example.com",
                password: hashedPassword,
                role: "user"
            }
        ]);

        // 2. Seed Rooms
        console.log("Seeding rooms...");
        await orm.insert(rooms).values([
            {
                room_code: "ROOM-1",
                room_name: "Meeting Room A",
                capacity: 10,
                description: "Ruang meeting kecil untuk 10 orang.",
                facilities: ["AC", "Proyektor", "Papan Tulis"],
                image_url: null
            },
            {
                room_code: "ROOM-2",
                room_name: "Conference Room",
                capacity: 50,
                description: "Ruang konferensi besar.",
                facilities: ["AC", "Proyektor", "Sound System", "Mic"],
                image_url: null
            }
        ]);

        // 3. Seed Bookings
        console.log("Seeding bookings...");
        const today = new Date();
        const tomorrowStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0, 0);
        const tomorrowEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0, 0);

        const nextWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 13, 0, 0);
        const nextWeekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 15, 0, 0);

        await orm.insert(bookings).values([
            {
                id_user: 2, // Merujuk ke Budi Santoso (asumsi ID 2)
                id_room: 1, // Merujuk ke Meeting Room A (asumsi ID 1)
                start_time: tomorrowStart,
                end_time: tomorrowEnd,
                purpose: "Meeting mingguan tim",
                status: "approved"
            },
            {
                id_user: 2,
                id_room: 2, // Merujuk ke Conference Room
                start_time: nextWeekStart,
                end_time: nextWeekEnd,
                purpose: "Presentasi klien besar",
                status: "pending"
            }
        ]);

        console.log("Seeding berhasil!");
    } catch (error) {
        console.error("Terjadi kesalahan saat seeding:", error);
    } finally {
        process.exit(0);
    }
}

main();