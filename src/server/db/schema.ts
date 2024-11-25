
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator((name) => `vit_${name}`);
const rolesEnum = ["owner", "admin", ] as const;

//export type of users

export const users = createTable("adminUser", {
  id: int("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  roles: text("roles", {
    enum: rolesEnum,
  })
    .default("admin")
    .notNull(),
  password: text("password").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  usernameIdx: index("username_idx").on(table.username),
}));

export const sessions = createTable("adminSession", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: int("expires_at").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  expiresAtIdx: index("expires_at_idx").on(table.expiresAt),
}));

export const brands = createTable("brand", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  nameIdx: index("brand_name_idx").on(table.name),
}));

export const categories = createTable("category", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  nameIdx: index("category_name_idx").on(table.name),
}));

export const products = createTable("product", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  brandId: int("brand_id").notNull().references(() => brands.id),
  categoryId: int("category_id").notNull().references(() => categories.id),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  nameIdx: index("product_name_idx").on(table.name),
  brandIdIdx: index("product_brand_id_idx").on(table.brandId),
  categoryIdIdx: index("product_category_id_idx").on(table.categoryId),
}));

export const productDetails = createTable("product_details", {
  id: int("id").primaryKey({ autoIncrement: true }),
  productId: int("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  capsuleCount: int("capsuleCount"),
  potency: text("potency"),
  price: text("price").notNull(),
  stock: int("stock").notNull(),
  status: text("status").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  productIdIdx: index("product_details_product_id_idx").on(table.productId),
  priceIdx: index("product_details_price_idx").on(table.price),
  stockIdx: index("product_details_stock_idx").on(table.stock),
}));

export const productImages = createTable("product_images", {
  id: int("id").primaryKey({ autoIncrement: true }),
  productId: int("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),  
  imageUrl: text("image_url").notNull(),
  isMain: int("isMain", {mode:"boolean"}).notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  productIdIdx: index("product_images_product_id_idx").on(table.productId),
}));

export const orders = createTable("order", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: int("user_id").notNull().references(() => users.id),
  orderDate: int("order_date").notNull(),
  status: text("status").notNull(),
  totalPrice: int("total_price").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  userIdIdx: index("order_user_id_idx").on(table.userId),
  orderDateIdx: index("order_date_idx").on(table.orderDate),
  statusIdx: index("order_status_idx").on(table.status),
}));

export const orderDetails = createTable("order_details", {
  id: int("id").primaryKey({ autoIncrement: true }),
  orderId: int("order_id").notNull().references(() => orders.id),
  productId: int("product_id").notNull().references(() => productDetails.id),
  quantity: int("quantity").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  orderIdIdx: index("order_details_order_id_idx").on(table.orderId),
  productIdIdx: index("order_details_product_id_idx").on(table.productId),
}));

export const sessionCart = createTable("session_cart", {
  id: int("id").primaryKey({ autoIncrement: true }),
  sessionId: int("session_id").notNull().references(() => sessions.id),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  sessionIdIdx: index("session_cart_session_id_idx").on(table.sessionId),
}));

export const userCart = createTable("user_cart", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: int("user_id").notNull().references(() => users.id),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({  
  userIdIdx: index("user_cart_user_id_idx").on(table.userId),
}));

export const cartItems = createTable("cart_items", {
  id: int("id").primaryKey({ autoIncrement: true }),
  sessionCartId: int("session_cart_id").references(() => sessionCart.id),
  userCartId: int("user_cart_id").references(() => userCart.id),
  productId: int("product_id").notNull().references(() => productDetails.id),
  quantity: int("quantity").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  sessionCartIdIdx: index("cart_items_session_cart_id_idx").on(table.sessionCartId),
  userCartIdIdx: index("cart_items_user_cart_id_idx").on(table.userCartId),
  productIdIdx: index("cart_items_product_id_idx").on(table.productId),
}));

export const Payment = createTable("payment", {
  id: int("id").primaryKey({ autoIncrement: true }),
  order_id: int("order_id").notNull().references(() => orders.id),
  payment_provider: text("payment_provider").notNull(),
  status: text("status").notNull(),
  payment_date: int("payment_date").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  orderIdIdx: index("payment_order_id_idx").on(table.order_id),
  statusIdx: index("payment_status_idx").on(table.status),
  paymentDateIdx: index("payment_date_idx").on(table.payment_date),
}));
export type UserType=InferSelectModel<typeof users>;
export type SessionType=InferSelectModel<typeof sessions>;
export type BrandType=InferSelectModel<typeof brands>;
export type CategoryType=InferSelectModel<typeof categories>;
export type ProductType=InferSelectModel<typeof products>;
export type ProductDetailsType=InferSelectModel<typeof productDetails>;
export type ProductImagesType=InferSelectModel<typeof productImages>;
export type OrderType=InferSelectModel<typeof orders>;
export type OrderDetailsType=InferSelectModel<typeof orderDetails>;
export type SessionCartType=InferSelectModel<typeof sessionCart>;
export type UserCartType=InferSelectModel<typeof userCart>;
export type CartItemsType=InferSelectModel<typeof cartItems>; 
export type PaymentType=InferSelectModel<typeof Payment>;
export type UserInsertType=InferInsertModel<typeof users>;
export type SessionInsertType=InferInsertModel<typeof sessions>;
export type BrandInsertType=InferInsertModel<typeof brands>;
export type CategoryInsertType=InferInsertModel<typeof categories>;
export type ProductInsertType=InferInsertModel<typeof products>;
export type ProductDetailsInsertType=InferInsertModel<typeof productDetails>;
export type ProductImagesInsertType=InferInsertModel<typeof productImages>;
export type OrderInsertType=InferInsertModel<typeof orders>;
export type OrderDetailsInsertType=InferInsertModel<typeof orderDetails>;   
export type SessionCartInsertType=InferInsertModel<typeof sessionCart>;
export type UserCartInsertType=InferInsertModel<typeof userCart>;
export type CartItemsInsertType=InferInsertModel<typeof cartItems>;
export type PaymentInsertType=InferInsertModel<typeof Payment>;

