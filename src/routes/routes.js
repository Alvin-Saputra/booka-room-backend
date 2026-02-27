import express from 'express';
import { getUsers } from '../controllers/user-controller.js';
import { getUserById } from '../controllers/user-controller.js';
import { createUser } from '../controllers/user-controller.js';
import { deleteUser } from '../controllers/user-controller.js';
import { updateUser } from '../controllers/user-controller.js';

import { getRooms } from '../controllers/room-controller.js';
import { createRoom } from '../controllers/room-controller.js';
import { getRoomById } from '../controllers/room-controller.js';
import { deleteRoom } from '../controllers/room-controller.js';
import { updateRoom } from '../controllers/room-controller.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send({ message: 'Welcome to the BookaRoom API!' });
});

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);


router.get('/rooms', getRooms);
router.get('/rooms/:id', getRoomById);
router.post('/rooms', createRoom);
router.delete('/rooms/:id', deleteRoom);
router.put('/rooms/:id', updateRoom);

export default router;