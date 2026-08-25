import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { orm } from "../database/orm.js";
import { users } from "../database/schema.js";
import { desc } from "drizzle-orm";

export const getUsers = async (req, res) => {
    try {
        const allUsers = await orm.select().from(users);
        return res.status(200).json({
            status: 'success',
            message: 'Users data retrieved successfully',
            data: allUsers
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

        const[specificUser] = await orm.select().from(users).where(eq(users.id, id));

        if (specificUser) {

            return res.status(200).json({
                status: 'success',
                message: 'User data retrieved successfully',
                data: specificUser
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
    const { userName, email, role, password } = req.body;

    if (!userName || !email || !role || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields',
            errorCode: 'ERR_MISSING_FIELDS',
            data: null,
        });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [specificUsers] = await orm.select().from(users).orderBy(desc(users.id)).limit(1);
        const userCode = "USER-" + (specificUsers.id + 1);

        const [header] = await orm.insert(users).values({
            user_code: userCode,
            user_name: userName,
            email: email,
            password: hashedPassword,
            role: role,
        });

        if (header && header.affectedRows > 0) {
            return res.status(201).json({
                status: 'success',
                message: 'Successfully created a user',
                data: {
                    id: header.insertId,
                    userCode,
                    userName,
                    email,
                    role
                }
            });
        } else {
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
        const [result] = await orm.delete(users).where(eq(users.id, id));
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

        const [result] = await orm.update(users).set({
            user_name: userName,
            email: email,
            role: role,
        }).where(eq(users.id, id));

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
