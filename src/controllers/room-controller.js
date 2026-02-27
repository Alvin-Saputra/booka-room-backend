import pool from "../config/db.js";

export const getRooms = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM rooms');
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


export const getRoomById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM rooms WHERE id = ?', [id]);
        if (rows.length > 0) {

            return res.status(200).json({
                status: 'success',
                data: rows[0]
            });
        }
        else {
            return res.status(404).json({
                status: 'error',
                message: 'Room not found'
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

export const createRoom = async (req, res) => {
    const { roomCode, roomName, capacity } = req.body;

    if (!roomCode || !roomName || !capacity) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields'
        });
    }

    if (capacity <= 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Capacity must be greater than 0'
        });
    }

    if (typeof capacity !== 'number') {
        return res.status(400).json({
            status: 'error',
            message: 'Capacity must be a number'
        });
    }

    try {
        const [result] = await pool.query('INSERT INTO rooms (room_code, room_name, capacity) VALUES (?, ?, ?)', [roomCode, roomName, capacity]);

        if (result.affectedRows > 0) {
            return res.status(201).json({
                status: 'success',
                data: {
                    id: result.insertId,
                    roomCode,
                    roomName,
                    capacity
                }
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


}


export const deleteRoom = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 'success',
                message: 'Room deleted successfully'
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


export const updateRoom = async (req, res) => {
    const { roomCode, roomName, capacity } = req.body;
    const { id } = req.params;

    if (!roomCode || !roomName || !capacity) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields'
        });
    }

    if (capacity <= 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Capacity must be greater than 0'
        });
    }

    if (typeof capacity !== 'number') {
        return res.status(400).json({
            status: 'error',
            message: 'Capacity must be a number'
        });
    }

    try {
        const [result] = await pool.query(
            'UPDATE rooms SET room_code = ?, room_name = ?, capacity = ? WHERE id = ?',
            [roomCode, roomName, capacity, id]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 'success',
                message: 'Room updated successfully',
                data: {
                    id,
                    roomCode,
                    roomName,
                    capacity
                }
            });
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'Room not found'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Database error'
        });
    }
};
