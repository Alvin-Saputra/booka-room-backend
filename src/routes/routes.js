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
import { approveBooking } from '../controllers/booking-controller.js';

import { createBookings, deleteBooking } from '../controllers/booking-controller.js';
import { getBookings } from '../controllers/booking-controller.js';
import { getBookingById } from '../controllers/booking-controller.js';

import { login } from '../controllers/auth-controller.js';

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

router.post('/bookings', createBookings);
router.get('/bookings', getBookings);
router.get('/bookings/:id', getBookingById)
router.delete('/bookings/:id', deleteBooking);
router.put('/bookings/approval/:id', approveBooking);

router.post('/login', login);

export default router;