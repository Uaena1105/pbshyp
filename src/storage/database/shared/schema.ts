import { pgTable, serial, varchar, timestamp, boolean, integer, jsonb, text, index, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 管理员
export const admins = pgTable(
  "admins",
  {
    id: serial().primaryKey(),
    username: varchar("username", { length: 64 }).notNull().unique(),
    password_hash: varchar("password_hash", { length: 255 }).notNull(),
    is_super: boolean("is_super").default(false).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("admins_username_idx").on(table.username),
  ]
);

// 站点
export const sites = pgTable(
  "sites",
  {
    id: serial().primaryKey(),
    slug: varchar("slug", { length: 100 }).notNull().unique(), // 访问路径，如 "1", "2", "plastic"
    name: varchar("name", { length: 200 }).notNull(),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("sites_slug_idx").on(table.slug),
    index("sites_is_active_idx").on(table.is_active),
  ]
);

// 站点设置（Logo、公司名、联系方式、SEO等）
export const site_settings = pgTable(
  "site_settings",
  {
    id: serial().primaryKey(),
    site_id: integer("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
    company_name: varchar("company_name", { length: 255 }),
    logo_url: varchar("logo_url", { length: 500 }),
    favicon_url: varchar("favicon_url", { length: 500 }),
    whatsapp: varchar("whatsapp", { length: 50 }),
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 100 }),
    address: text("address"),
    seo_title: varchar("seo_title", { length: 255 }),
    seo_description: text("seo_description"),
    seo_keywords: varchar("seo_keywords", { length: 500 }),
    footer_text: text("footer_text"),
    primary_color: varchar("primary_color", { length: 20 }).default("#1e40af"),
    // 首页Hero区
    hero_title: varchar("hero_title", { length: 500 }),
    hero_subtitle: text("hero_subtitle"),
    hero_image: varchar("hero_image", { length: 500 }),
    hero_button_text: varchar("hero_button_text", { length: 100 }),
    hero_button_link: varchar("hero_button_link", { length: 500 }),
  },
  (table) => [
    index("site_settings_site_id_idx").on(table.site_id),
  ]
);

// 导航菜单
export const nav_links = pgTable(
  "nav_links",
  {
    id: serial().primaryKey(),
    site_id: integer("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 100 }).notNull(),
    href: varchar("href", { length: 500 }).notNull(),
    sort_order: integer("sort_order").default(0).notNull(),
    is_active: boolean("is_active").default(true).notNull(),
  },
  (table) => [
    index("nav_links_site_id_idx").on(table.site_id),
    index("nav_links_sort_order_idx").on(table.sort_order),
  ]
);

// 页面内容
export const pages = pgTable(
  "pages",
  {
    id: serial().primaryKey(),
    site_id: integer("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 100 }).notNull(), // home, about, contact
    title: varchar("title", { length: 255 }).notNull(),
    content: jsonb("content").default({}).notNull(), // 页面结构化内容
    banner_image: varchar("banner_image", { length: 500 }),
    is_published: boolean("is_published").default(true).notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("pages_site_id_slug_idx").on(table.site_id, table.slug),
  ]
);

// 产品分类
export const categories = pgTable(
  "categories",
  {
    id: serial().primaryKey(),
    site_id: integer("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull(),
    description: text("description"),
    image: varchar("image", { length: 500 }),
    sort_order: integer("sort_order").default(0).notNull(),
    is_active: boolean("is_active").default(true).notNull(),
    parent_id: integer("parent_id"),
  },
  (table) => [
    index("categories_site_id_idx").on(table.site_id),
    index("categories_sort_order_idx").on(table.sort_order),
  ]
);

// 产品
export const products = pgTable(
  "products",
  {
    id: serial().primaryKey(),
    site_id: integer("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
    category_id: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    model: varchar("model", { length: 100 }),
    price: numeric("price", { precision: 10, scale: 2 }),
    main_image: varchar("main_image", { length: 500 }),
    images: jsonb("images").default(sql`'[]'::jsonb`).notNull(),
    short_description: text("short_description"),
    description: text("description"),
    specifications: jsonb("specifications").default(sql`'[]'::jsonb`).notNull(),
    sort_order: integer("sort_order").default(0).notNull(),
    is_active: boolean("is_active").default(true).notNull(),
    is_featured: boolean("is_featured").default(false).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("products_site_id_idx").on(table.site_id),
    index("products_category_id_idx").on(table.category_id),
    index("products_is_featured_idx").on(table.is_featured),
    index("products_sort_order_idx").on(table.sort_order),
  ]
);

// Banner轮播图
export const banners = pgTable(
  "banners",
  {
    id: serial().primaryKey(),
    site_id: integer("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
    image: varchar("image", { length: 500 }).notNull(),
    title: varchar("title", { length: 255 }),
    subtitle: varchar("subtitle", { length: 500 }),
    button_text: varchar("button_text", { length: 100 }),
    button_link: varchar("button_link", { length: 500 }),
    sort_order: integer("sort_order").default(0).notNull(),
    is_active: boolean("is_active").default(true).notNull(),
  },
  (table) => [
    index("banners_site_id_idx").on(table.site_id),
    index("banners_sort_order_idx").on(table.sort_order),
  ]
);

// 新闻
export const news = pgTable(
  "news",
  {
    id: serial().primaryKey(),
    site_id: integer("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    category: varchar("category", { length: 50 }).default("industry"),
    cover_image: varchar("cover_image", { length: 500 }),
    summary: text("summary"),
    content: text("content"),
    published_at: timestamp("published_at", { withTimezone: true }).defaultNow().notNull(),
    is_published: boolean("is_published").default(true).notNull(),
    sort_order: integer("sort_order").default(0).notNull(),
  },
  (table) => [
    index("news_site_id_idx").on(table.site_id),
    index("news_published_at_idx").on(table.published_at),
  ]
);

// 管理员会话token
export const admin_sessions = pgTable(
  "admin_sessions",
  {
    id: serial().primaryKey(),
    admin_id: integer("admin_id").notNull().references(() => admins.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 64 }).notNull().unique(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("admin_sessions_token_idx").on(table.token),
    index("admin_sessions_admin_id_idx").on(table.admin_id),
  ]
);
