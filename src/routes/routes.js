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
import { getBookingsByUserId } from '../controllers/booking-controller.js';

import { login } from '../controllers/auth-controller.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth-middlware.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send({ message: 'Welcome to the BookaRoom API!' });
});

router.get('/users', verifyToken, authorizeRoles('admin'), getUsers);
router.get('/users/:id', verifyToken, authorizeRoles('admin', 'user'), getUserById);
router.post('/users', verifyToken, authorizeRoles('admin'), createUser);
router.delete('/users/:id', verifyToken, authorizeRoles('admin'), deleteUser);
router.put('/users/:id', verifyToken, authorizeRoles('admin'), updateUser);


router.get('/rooms', verifyToken, getRooms);
router.get('/rooms/:id', verifyToken, getRoomById);
router.post('/rooms', verifyToken, authorizeRoles('admin'), createRoom);
router.delete('/rooms/:id', verifyToken, authorizeRoles('admin'), deleteRoom);
router.put('/rooms/:id', verifyToken, authorizeRoles('admin'), updateRoom);

router.post('/bookings', verifyToken, authorizeRoles('admin', 'user'), createBookings);
router.get('/bookings', getBookings);
router.get('/bookings/:id', getBookingById)
router.delete('/bookings/:id', verifyToken, authorizeRoles('admin'), deleteBooking);
router.put('/bookings/approval/:id', verifyToken, authorizeRoles('admin'), approveBooking);
router.get('/bookings/user/:id', verifyToken, authorizeRoles('admin', 'user'), getBookingsByUserId);

router.post('/login', login);

export default router;