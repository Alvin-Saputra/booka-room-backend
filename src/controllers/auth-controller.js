import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {

            const { id, user_code, user_name, email, password: hashedPassword, role } = rows[0];
            const isMatched = bcrypt.compareSync(password, hashedPassword);

            if (isMatched) {
                const token = jwt.sign(
                    { id: id, username: user_name, email: email, role: role },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                return res.status(200).json({
                    status: 'success',
                    message: 'Successfully login',
                    data: {
                        id,
                        user_code,
                        user_name,
                        email,
                        role,
                        token
                    }
                });
            }
            else {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials',
                    errorCode: 'ERR_INVALID_CREDENTIALS',
                    data: null
                });
            }
        }
        else {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials',
                errorCode: 'ERR_INVALID_CREDENTIALS',
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