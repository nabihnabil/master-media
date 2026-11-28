CREATE TABLE `answer_events` (
	`id` text PRIMARY KEY NOT NULL,
	`room` text NOT NULL,
	`slide` text NOT NULL,
	`person` text NOT NULL,
	`value` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `report_sessions` (
	`token` text PRIMARY KEY NOT NULL,
	`room` text NOT NULL,
	`student` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `rooms` ADD `ended` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `rooms` ADD `expected` text DEFAULT '[]' NOT NULL;