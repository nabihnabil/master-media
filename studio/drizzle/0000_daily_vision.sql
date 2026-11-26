CREATE TABLE `answers` (
	`room` text NOT NULL,
	`slide` text NOT NULL,
	`person` text NOT NULL,
	`value` text NOT NULL,
	`created` integer NOT NULL,
	PRIMARY KEY(`room`, `slide`, `person`)
);
--> statement-breakpoint
CREATE TABLE `decks` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`published` text,
	`version` integer DEFAULT 1 NOT NULL,
	`updated` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `people` (
	`id` text PRIMARY KEY NOT NULL,
	`room` text NOT NULL,
	`name` text NOT NULL,
	`token` text NOT NULL,
	`hand` integer DEFAULT 0 NOT NULL,
	`joined` integer NOT NULL,
	`seen` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`deck` text NOT NULL,
	`data` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`answers_open` integer DEFAULT 0 NOT NULL,
	`show_results` integer DEFAULT 0 NOT NULL,
	`show_names` integer DEFAULT 0 NOT NULL,
	`display_key` text NOT NULL,
	`created` integer NOT NULL
);
