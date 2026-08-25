import { mysqlTable, serial, varchar, int, timestamp, text, mysqlEnum, json } from "drizzle-orm/mysql-core";

// Tabel Users
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  user_code: varchar('user_code', { length: 255 }),
  user_name: varchar('user_name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  password: varchar('password', { length: 255 }),
  role: mysqlEnum('role', ['admin', 'user']),
});

// Tabel Rooms
export const rooms = mysqlTable('rooms', {
  id: int('id').autoincrement().primaryKey(),
  room_code: varchar('room_code', { length: 255 }),
  room_name: varchar('room_name', { length: 255 }),
  capacity: int('capacity'),
  description: text('description'),
  facilities: json('facilities'),
  image_url: varchar('image_url', { length: 255 }),
});

// Tabel Bookings
export const bookings = mysqlTable('bookings', {
  id: int('id').autoincrement().primaryKey(),
  id_user: int('id_user').references(() => users.id, { onDelete: 'cascade' }),
  id_room: int('id_room').references(() => rooms.id, { onDelete: 'cascade' }),
  start_time: timestamp('start_time'),
  end_time: timestamp('end_time'),
  purpose: varchar('purpose', { length: 255 }),
  status: mysqlEnum('status', ['approved', 'pending', 'rejected']),
  booked_at: timestamp('booked_at').defaultNow(),
});