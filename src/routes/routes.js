import express from 'express';
import { getUsers } from '../controllers/user-controller.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send({ message: 'Welcome to the BookaRoom API!' });
});

router.get('/users', getUsers);

export default router;