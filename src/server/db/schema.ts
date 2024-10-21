
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
  logo_url: text("logo_url").notNull(),
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
  brand_id: text("brand_id").notNull().references(() => brands.id),
  category_id: text("category_id").notNull().references(() => categories.id),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  nameIdx: index("product_name_idx").on(table.name),
  brandIdIdx: index("product_brand_id_idx").on(table.brand_id),
  categoryIdIdx: index("product_category_id_idx").on(table.category_id),
}));

export const productDetails = createTable("product_details", {
  id: int("id").primaryKey({ autoIncrement: true }),
  productId: text("product_id").notNull().references(() => products.id),
  variationName: text("variationName").notNull(),
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
  productId: text("product_id").notNull().references(() => productDetails.id),
  image_url: text("image_url").notNull(),
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
  user_id: text("user_id").notNull().references(() => users.id),
  order_date: int("order_date").notNull(),
  status: text("status").notNull(),
  total_price: int("total_price").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  userIdIdx: index("order_user_id_idx").on(table.user_id),
  orderDateIdx: index("order_date_idx").on(table.order_date),
  statusIdx: index("order_status_idx").on(table.status),
}));

export const orderDetails = createTable("order_details", {
  id: int("id").primaryKey({ autoIncrement: true }),
  order_id: text("order_id").notNull().references(() => orders.id),
  product_id: text("product_id").notNull().references(() => productDetails.id),
  quantity: int("quantity").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  orderIdIdx: index("order_details_order_id_idx").on(table.order_id),
  productIdIdx: index("order_details_product_id_idx").on(table.product_id),
}));

export const sessionCart = createTable("session_cart", {
  id: int("id").primaryKey({ autoIncrement: true }),
  session_id: text("session_id").notNull().references(() => sessions.id),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  sessionIdIdx: index("session_cart_session_id_idx").on(table.session_id),
}));

export const userCart = createTable("user_cart", {
  id: int("id").primaryKey({ autoIncrement: true }),
  user_id: text("user_id").notNull().references(() => users.id),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({  
  userIdIdx: index("user_cart_user_id_idx").on(table.user_id),
}));

export const cartItems = createTable("cart_items", {
  id: int("id").primaryKey({ autoIncrement: true }),
  session_cart_id: text("session_cart_id").references(() => sessionCart.id),
  user_cart_id: text("user_cart_id").references(() => userCart.id),
  product_id: text("product_id").notNull().references(() => productDetails.id),
  quantity: int("quantity").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  sessionCartIdIdx: index("cart_items_session_cart_id_idx").on(table.session_cart_id),
  userCartIdIdx: index("cart_items_user_cart_id_idx").on(table.user_cart_id),
  productIdIdx: index("cart_items_product_id_idx").on(table.product_id),
}));

export const Payment = createTable("payment", {
  id: int("id").primaryKey({ autoIncrement: true }),
  order_id: text("order_id").notNull().references(() => orders.id),
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

