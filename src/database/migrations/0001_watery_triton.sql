ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_id_user_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_id_room_rooms_id_fk`;
--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_id_user_users_id_fk` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_id_room_rooms_id_fk` FOREIGN KEY (`id_room`) REFERENCES `rooms`(`id`) ON DELETE cascade ON UPDATE no action;