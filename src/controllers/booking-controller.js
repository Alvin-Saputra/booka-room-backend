import pool from "../config/db.js";


export const createBookings = async (req, res) => {
    const { userId, roomId, startTime, endTime, purpose, status } = req.body;

    if (!userId || !roomId || !startTime || !endTime || !purpose) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields'
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

        const [result] = await pool.query(
            'INSERT INTO bookings (id_user, id_room, start_time, end_time, purpose, status, booked_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, roomId, startTime, endTime, purpose, roomStatus, bookedAt]
        );

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
                }
            });
        }

        else {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create booking'
            });
        }
    }

    catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Database error'
        });
    }
};


export const getBookings = async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT 
                bookings.id AS booking_id,
                users.user_name,
                rooms.room_name,
                bookings.start_time,
                bookings.end_time,
                bookings.purpose,
                bookings.status,
                bookings.booked_at
            FROM bookings
            JOIN users ON bookings.id_user = users.id
            JOIN rooms ON bookings.id_room = rooms.id`);
        const data = [];
        for (const item of rows) {
            data.push({
                id: item.booking_id,
                user_name: item.user_name,
                room_name: item.room_name,
                start_time: item.start_time,
                end_time: item.end_time,
                purpose: item.purpose,
                status: item.status,
                booked_at: item.booked_at
            });
        }

        return res.status(200).json({
            status: 'success',
            data: data
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Database error'
        });
    }
};


export const getBookingById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);

        if (rows.length > 0) {

            return res.status(200).json({
                status: 'success',
                data: rows[0]
            });
        }
        else {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found'
            });
        }

    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Database error'
        });
    }
};

export const getBookingsByUserId = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`SELECT 
                bookings.id AS booking_id,
                users.user_name,
                rooms.room_name,
                bookings.start_time,
                bookings.end_time,
                bookings.purpose,
                bookings.status,
                bookings.booked_at
            FROM bookings
            JOIN users ON bookings.id_user = users.id
            JOIN rooms ON bookings.id_room = rooms.id WHERE users.id = ?`, [id]);

        const data = [];

        for (const item of rows) {
            data.push({
                id: item.booking_id,
                user_name: item.user_name,
                room_name: item.room_name,
                start_time: item.start_time,
                end_time: item.end_time,
                purpose: item.purpose,
                status: item.status,
                booked_at: item.booked_at
            });
        }

        return res.status(200).json({
            status: 'success',
            data: data
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Database error'
        });
    }
}


export const deleteBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 'success',
                message: 'Booking deleted successfully'
            })
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Database error'
        });
    }

};

export const approveBooking = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const [result] = await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 'success',
                message: 'Booking ' + status + ' successfully'
            })
        }
    } catch (error) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Database error'
        });
    }

}