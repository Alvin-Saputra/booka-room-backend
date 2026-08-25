import pool from "../config/db.js";
import { eq, desc, and, lte, gte } from "drizzle-orm";
import { orm } from "../database/orm.js";
import { bookings, users, rooms } from "../database/schema.js";
import { count } from "drizzle-orm";


export const createBookings = async (req, res) => {
    const { userId, roomId, startTime, endTime, purpose, status } = req.body;

    if (!userId || !roomId || !startTime || !endTime || !purpose) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields',
            errorCode: 'ERR_MISSING_FIELDS',
            data: null
        });
    }

    let roomStatus = "pending";

    if (status) {
        roomStatus = status;
    }

    try {
        // const bookedAt = new Date();
        const now = new Date();
        // Format the date to MySQL DATETIME format: YYYY-MM-DD HH:MM:SS based on local time
        const bookedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        // Cek apakah ruangan sudah dibooking pada jam tersebut
        const existingBookings = await orm.select().from(bookings).where(
            and(
                eq(bookings.id_room, roomId), // <-- Saya tambahkan pengecekan id_room agar tidak mengecek kamar lain
                lte(bookings.start_time, new Date(endTime)),
                gte(bookings.end_time, new Date(startTime))
            )
        );

        if (existingBookings.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Room is already booked for the selected time period',
                errorCode: 'ERR_ROOM_ALREADY_BOOKED',
                data: null
            });
        }


        const [result] = await orm.insert(bookings).values({
            id_user: userId,
            id_room: roomId,
            start_time: new Date(startTime),
            end_time: new Date(endTime),
            purpose: purpose,
            status: roomStatus,
            booked_at: now // <-- Kita bisa langsung memasukkan objek Date
        })

        if (result.affectedRows > 0) {
            return res.status(201).json({
                status: 'success',
                data: {
                    id: result.insertId,
                    userId,
                    roomId,
                    startTime,
                    endTime,
                    purpose,
                    status,
                    bookedAt
                },
                message: "Booking successfully created"
            });
        }

        else {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create booking',
                errorCode: 'ERR_CREATE_FAILED',
                data: null,
            });
        }
    }

    catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Database error',
            errorCode: 'ERR_DATABASE',
            data: null
        });
    }
};


export const getBookings = async (req, res) => {
    try {
        const result = await orm.select().from(bookings)
        .innerJoin(users, eq(bookings.id_user, users.id))
        .innerJoin(rooms, eq(bookings.id_room, rooms.id));


        return res.status(200).json({
            status: 'success',
            message: "Booking data retreived successfully",
            data: result
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Database error',
            errorCode: 'ERR_DATABASE',
            data: null
        });
    }
};


export const getBookingById = async (req, res) => {
    const { id } = req.params;

    try {
        const [specificBooking] = await orm.select().from(bookings).where(eq(bookings.id, id));

        if (specificBooking) {

            return res.status(200).json({
                status: 'success',
                message: "Booking data retreived successfully",
                data: specificBooking
            });
        }
        else {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found',
                errorCode: 'ERR_NOT_FOUND',
                data: null
            });
        }

    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Database error',
            errorCode: 'ERR_DATABASE',
            data: null
        });
    }
};

export const getBookingsByUserId = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await orm.select().from(bookings)
        .innerJoin(users, eq(bookings.id_user, users.id))
        .innerJoin(rooms, eq(bookings.id_room, rooms.id)).where((eq(users.id, id)));

     

        return res.status(200).json({
            status: 'success',
            message: "Booking data retreived successfully",
            data: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Database error',
            errorCode: 'ERR_DATABASE',
            data: null
        });
    }
}


export const deleteBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await orm.delete(bookings).where(eq(bookings.id, id));
        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 'success',
                message: 'Booking deleted successfully',
                data: null
            })
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Database error',
            errorCode: 'ERR_DATABASE',
            data: null
        });
    }

};

export const approveBooking = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const [result] = await orm.update(bookings).set({               
                status: status
            }).where(eq(bookings.id, id));

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 'success',
                message: 'Booking ' + status + ' successfully',
                data: null
            })
        }
    } catch (error) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Database error',
            errorCode: 'ERR_DATABASE',
            data: null
        });
    }


}

export const getBookingStats = async (req, res) => {
    try {

        const result = await orm.select({
        status: bookings.status,    // Kolom yang dijadikan kriteria grouping
        count: count()              // Hasil perhitungan / counting
    }).from(bookings).groupBy(bookings.status);

        let statusCount = {
            pending: 0,
            approved: 0,
            rejected: 0
        };

        for (const item of result) {
            if (item.status.toLowerCase() === 'pending') statusCount.pending = item.count;
            if (item.status.toLowerCase() === 'approved') statusCount.approved = item.count;
            if (item.status.toLowerCase() === 'rejected') statusCount.rejected = item.count;
        }
        return res.status(200).json({
            status: 'success',
            message: 'Booking statistic retrived successfully',
            data: {
                status_count: statusCount
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Database error',
            errorCode: 'ERR_DATABASE',
            data: null
        });
    }
};