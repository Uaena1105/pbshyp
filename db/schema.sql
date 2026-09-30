-- 多站点 CMS 数据库初始化脚本 (PostgreSQL)
-- 使用 Supabase SQL Editor 或 psql 执行本文件。

CREATE TABLE IF NOT EXISTS health_check (
  id serial NOT NULL,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admins (
  id serial PRIMARY KEY,
  username varchar(64) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  is_super boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS admins_username_idx ON admins (username);

CREATE TABLE IF NOT EXISTS sites (
  id serial PRIMARY KEY,
  slug varchar(100) NOT NULL UNIQUE,
  name varchar(200) NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS sites_slug_idx ON sites (slug);
CREATE INDEX IF NOT EXISTS sites_is_active_idx ON sites (is_active);

CREATE TABLE IF NOT EXISTS site_settings (
  id serial PRIMARY KEY,
  site_id integer NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
  company_name varchar(255),
  logo_url varchar(500),
  favicon_url varchar(500),
  whatsapp varchar(50),
  phone varchar(50),
  email varchar(100),
  address text,
  seo_title varchar(255),
  seo_description text,
  seo_keywords varchar(500),
  footer_text text,
  primary_color varchar(20) DEFAULT '#1e40af',
  hero_title varchar(500),
  hero_subtitle text,
  hero_image varchar(500),
  hero_button_text varchar(100),
  hero_button_link varchar(500),
  home_content jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS site_settings_site_id_idx ON site_settings (site_id);

CREATE TABLE IF NOT EXISTS nav_links (
  id serial PRIMARY KEY,
  site_id integer NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
  label varchar(100) NOT NULL,
  href varchar(500) NOT NULL,
  sort_order integer DEFAULT 0 NOT NULL,
  is_active boolean DEFAULT true NOT NULL
);

CREATE INDEX IF NOT EXISTS nav_links_site_id_idx ON nav_links (site_id);
CREATE INDEX IF NOT EXISTS nav_links_sort_order_idx ON nav_links (sort_order);

CREATE TABLE IF NOT EXISTS pages (
  id serial PRIMARY KEY,
  site_id integer NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
  slug varchar(100) NOT NULL,
  title varchar(255) NOT NULL,
  content jsonb DEFAULT '{}'::jsonb NOT NULL,
  banner_image varchar(500),
  is_published boolean DEFAULT true NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS pages_site_id_slug_idx ON pages (site_id, slug);

CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  site_id integer NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
  name varchar(200) NOT NULL,
  slug varchar(200) NOT NULL,
  description text,
  image varchar(500),
  sort_order integer DEFAULT 0 NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  parent_id integer
);

CREATE INDEX IF NOT EXISTS categories_site_id_idx ON categories (site_id);
CREATE INDEX IF NOT EXISTS categories_sort_order_idx ON categories (sort_order);

CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  site_id integer NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
  category_id integer REFERENCES categories (id) ON DELETE SET NULL,
  name varchar(255) NOT NULL,
  slug varchar(255) NOT NULL,
  model varchar(100),
  price numeric(10, 2),
  main_image varchar(500),
  images jsonb DEFAULT '[]'::jsonb NOT NULL,
  short_description text,
  description text,
  specifications jsonb DEFAULT '[]'::jsonb NOT NULL,
  sort_order integer DEFAULT 0 NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  is_featured boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS products_site_id_idx ON products (site_id);
CREATE INDEX IF NOT EXISTS products_category_id_idx ON products (category_id);
CREATE INDEX IF NOT EXISTS products_is_featured_idx ON products (is_featured);
CREATE INDEX IF NOT EXISTS products_sort_order_idx ON products (sort_order);

CREATE TABLE IF NOT EXISTS banners (
  id serial PRIMARY KEY,
  site_id integer NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
  image varchar(500) NOT NULL,
  title varchar(255),
  subtitle varchar(500),
  button_text varchar(100),
  button_link varchar(500),
  sort_order integer DEFAULT 0 NOT NULL,
  is_active boolean DEFAULT true NOT NULL
);

CREATE INDEX IF NOT EXISTS banners_site_id_idx ON banners (site_id);
CREATE INDEX IF NOT EXISTS banners_sort_order_idx ON banners (sort_order);

CREATE TABLE IF NOT EXISTS news (
  id serial PRIMARY KEY,
  site_id integer NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  slug varchar(255) NOT NULL,
  category varchar(50) DEFAULT 'industry',
  cover_image varchar(500),
  summary text,
  content text,
  published_at timestamptz DEFAULT now() NOT NULL,
  is_published boolean DEFAULT true NOT NULL,
  sort_order integer DEFAULT 0 NOT NULL
);

CREATE INDEX IF NOT EXISTS news_site_id_idx ON news (site_id);
CREATE INDEX IF NOT EXISTS news_published_at_idx ON news (published_at);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id serial PRIMARY KEY,
  admin_id integer NOT NULL REFERENCES admins (id) ON DELETE CASCADE,
  token varchar(64) NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS admin_sessions_token_idx ON admin_sessions (token);
CREATE INDEX IF NOT EXISTS admin_sessions_admin_id_idx ON admin_sessions (admin_id);