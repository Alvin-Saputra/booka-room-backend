CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`id_user` int,
	`id_room` int,
	`start_time` timestamp,
	`end_time` timestamp,
	`purpose` varchar(255),
	`status` enum('approved','pending','rejected'),
	`booked_at` timestamp DEFAULT (now()),
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`room_code` varchar(255),
	`room_name` varchar(255),
	`capacity` int,
	`description` text,
	`facilities` json,
	`image_url` varchar(255),
	CONSTRAINT `rooms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_code` varchar(255),
	`user_name` varchar(255),
	`email` varchar(255),
	`password` varchar(255),
	`role` enum('admin','user'),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_id_user_users_id_fk` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_id_room_rooms_id_fk` FOREIGN KEY (`id_room`) REFERENCES `rooms`(`id`) ON DELETE no action ON UPDATE no action;