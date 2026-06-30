import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        return res.status(200).json({
            status: 'success',
            message: 'Users data retrieved successfully',
            data: rows
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


export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

        if (rows.length > 0) {

            return res.status(200).json({
                status: 'success',
                message: 'User data retrieved successfully',
                data: rows[0]
            });
        }
        else {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
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

export const createUser = async (req, res) => {
    const saltRounds = 10;
    const { userName, email, role } = req.body;

    if (!userName || !email || !role) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields',
            errorCode: 'ERR_MISSING_FIELDS',
            data: null,
        });
    }

    try {

        const password = "password123";

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [rows] = await pool.query('SELECT id FROM users ORDER BY id DESC LIMIT 1');
        // console.log(
        //     latestId
        // );

        const userCode = "USER-" + (rows[0].id + 1);

        const [result] = await pool.query('INSERT INTO users (user_code, user_name, email, password, role) VALUES (?, ?, ?, ?, ?)', [userCode, userName, email, hashedPassword, role]);

        if (result.affectedRows > 0) {
            return res.status(201).json({
                status: 'success',
                message: 'Successfully created a user',
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
                message: 'Failed to create user',
                errorCode: 'ERR_CREATE_FAILED',
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


}


export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 'success',
                message: 'User deleted successfully',
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


export const updateUser = async (req, res) => {
    const { userName, email, role } = req.body;
    const { id } = req.params;

    if (!userName || !email || !role) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields',
            errorCode: 'ERR_MISSING_FIELDS',
            data: null
        });
    }

    try {
        const [result] = await pool.query(
            'UPDATE users SET user_name = ?, email = ?, role = ? WHERE id = ?',
            [userName, email, role, id]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 'success',
                message: 'User updated successfully',
                data: {
                    userName,
                    email,
                    role
                }
            });
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                errorCode: 'ERR_NOT_FOUND',
                data: null
            });
        }
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
