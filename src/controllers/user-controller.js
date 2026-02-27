import pool from "../config/db.js";

export const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        return res.json({
            status: 'success',
            data: rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }


};
