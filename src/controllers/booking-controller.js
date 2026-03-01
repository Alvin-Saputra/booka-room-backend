import pool from "../config/db.js";


export const createBookings = async (req, res) => {
    const { userId, roomId, startTime, endTime, purpose, status, bookedAt } = req.body;

    if (!userId || !roomId || !startTime || !endTime || !purpose || !status || !bookedAt) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields'
        });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO bookings (id_user, id_room, start_time, end_time, purpose, status, booked_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, roomId, startTime, endTime, purpose, status, bookedAt]
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

         else{
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
        const [rows] = await pool.query('SELECT * FROM bookings');
        return res.status(200).json({
            status: 'success',
            data: rows
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