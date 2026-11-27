CREATE TABLE `grades` (
	`room` text NOT NULL,
	`person` text NOT NULL,
	`slide` text NOT NULL,
	`points` real NOT NULL,
	`feedback` text DEFAULT '' NOT NULL,
	`updated` integer NOT NULL,
	PRIMARY KEY(`room`, `person`, `slide`)
);
--> statement-breakpoint
CREATE TABLE `student_files` (
	`id` text PRIMARY KEY NOT NULL,
	`student` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`profile` text DEFAULT '{}' NOT NULL,
	`code_hash` text NOT NULL,
	`photo` text DEFAULT '' NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`created` integer NOT NULL,
	`failures` integer DEFAULT 0 NOT NULL,
	`locked_until` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `visits` (
	`room` text NOT NULL,
	`person` text NOT NULL,
	`slide` text NOT NULL,
	`first` integer NOT NULL,
	`last` integer NOT NULL,
	`duration` integer DEFAULT 0 NOT NULL,
	`hands` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`room`, `person`, `slide`)
);
--> statement-breakpoint
ALTER TABLE `people` ADD `student` text;--> statement-breakpoint
ALTER TABLE `people` ADD `last_slide` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `people_room_student` ON `people` (`room`,`student`);--> statement-breakpoint
ALTER TABLE `rooms` ADD `scoring` text DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE `rooms` ADD `started` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `rooms` ADD `roster_only` integer DEFAULT 1 NOT NULL;