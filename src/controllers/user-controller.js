import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
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


export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

        if (rows.length > 0) {

            return res.status(200).json({
                status: 'success',
                data: rows[0]
            });
        }
        else {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
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

export const createUser = async (req, res) => {
    const saltRounds = 10;
    const { userCode, userName, email, password, role } = req.body;

    if (!userCode || !userName || !email || !password || !role) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields'
        });
    }

    try {
       const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await pool.query('INSERT INTO users (user_code, user_name, email, password, role) VALUES (?, ?, ?, ?, ?)', [userCode, userName, email, hashedPassword, role]);

        if (result.affectedRows > 0) {
            return res.status(201).json({
                status: 'success',
                data: {
                    id: result.insertId,
                    userCode,
                    userName,
                    email,
                    role
                }
            });
        }
        else {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create user'
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


export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 'success',
                message: 'User deleted successfully'
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


export const updateUser = async (req, res) => {
    const { userCode, userName, email, password, role } = req.body;
    const { id } = req.params;

    if (!userCode || !userName || !email || !password || !role) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields'
        });
    }

    try {
        const [result] = await pool.query(
            'UPDATE users SET user_code = ?, user_name = ?, email = ?, password = ?, role = ? WHERE id = ?',
            [userCode, userName, email, password, role, id]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 'success',
                message: 'User updated successfully',
                data: {
                    id,
                    userCode,
                    userName,
                    email,
                    role
                }
            });
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
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
