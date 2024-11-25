CREATE TABLE `vit_payment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`payment_provider` text NOT NULL,
	`status` text NOT NULL,
	`payment_date` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`order_id`) REFERENCES `vit_order`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vit_brand` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`logo_url` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `vit_cart_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_cart_id` integer,
	`user_cart_id` integer,
	`product_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`session_cart_id`) REFERENCES `vit_session_cart`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_cart_id`) REFERENCES `vit_user_cart`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `vit_product_details`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vit_category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `vit_order_details` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`order_id`) REFERENCES `vit_order`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `vit_product_details`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vit_order` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`order_date` integer NOT NULL,
	`status` text NOT NULL,
	`total_price` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `vit_adminUser`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vit_product_details` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`capsuleCount` integer,
	`potency` text,
	`price` text NOT NULL,
	`stock` integer NOT NULL,
	`status` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`product_id`) REFERENCES `vit_product`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `vit_product_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`image_url` text NOT NULL,
	`isMain` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`product_id`) REFERENCES `vit_product`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `vit_product` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`brand_id` integer NOT NULL,
	`category_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`brand_id`) REFERENCES `vit_brand`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `vit_category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vit_session_cart` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`session_id`) REFERENCES `vit_adminSession`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vit_adminSession` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `vit_adminUser`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vit_user_cart` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `vit_adminUser`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vit_adminUser` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`roles` text DEFAULT 'admin' NOT NULL,
	`password` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `payment_order_id_idx` ON `vit_payment` (`order_id`);--> statement-breakpoint
CREATE INDEX `payment_status_idx` ON `vit_payment` (`status`);--> statement-breakpoint
CREATE INDEX `payment_date_idx` ON `vit_payment` (`payment_date`);--> statement-breakpoint
CREATE INDEX `brand_name_idx` ON `vit_brand` (`name`);--> statement-breakpoint
CREATE INDEX `cart_items_session_cart_id_idx` ON `vit_cart_items` (`session_cart_id`);--> statement-breakpoint
CREATE INDEX `cart_items_user_cart_id_idx` ON `vit_cart_items` (`user_cart_id`);--> statement-breakpoint
CREATE INDEX `cart_items_product_id_idx` ON `vit_cart_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `category_name_idx` ON `vit_category` (`name`);--> statement-breakpoint
CREATE INDEX `order_details_order_id_idx` ON `vit_order_details` (`order_id`);--> statement-breakpoint
CREATE INDEX `order_details_product_id_idx` ON `vit_order_details` (`product_id`);--> statement-breakpoint
CREATE INDEX `order_user_id_idx` ON `vit_order` (`user_id`);--> statement-breakpoint
CREATE INDEX `order_date_idx` ON `vit_order` (`order_date`);--> statement-breakpoint
CREATE INDEX `order_status_idx` ON `vit_order` (`status`);--> statement-breakpoint
CREATE INDEX `product_details_product_id_idx` ON `vit_product_details` (`product_id`);--> statement-breakpoint
CREATE INDEX `product_details_price_idx` ON `vit_product_details` (`price`);--> statement-breakpoint
CREATE INDEX `product_details_stock_idx` ON `vit_product_details` (`stock`);--> statement-breakpoint
CREATE INDEX `product_images_product_id_idx` ON `vit_product_images` (`product_id`);--> statement-breakpoint
CREATE INDEX `product_name_idx` ON `vit_product` (`name`);--> statement-breakpoint
CREATE INDEX `product_brand_id_idx` ON `vit_product` (`brand_id`);--> statement-breakpoint
CREATE INDEX `product_category_id_idx` ON `vit_product` (`category_id`);--> statement-breakpoint
CREATE INDEX `session_cart_session_id_idx` ON `vit_session_cart` (`session_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `vit_adminSession` (`user_id`);--> statement-breakpoint
CREATE INDEX `expires_at_idx` ON `vit_adminSession` (`expires_at`);--> statement-breakpoint
CREATE INDEX `user_cart_user_id_idx` ON `vit_user_cart` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `vit_adminUser_username_unique` ON `vit_adminUser` (`username`);--> statement-breakpoint
CREATE INDEX `username_idx` ON `vit_adminUser` (`username`);