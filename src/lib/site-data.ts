import { cache } from 'react';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export interface Site {
  id: number;
  slug: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  site_id: number;
  company_name: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  footer_text: string | null;
  primary_color: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image: string | null;
  hero_button_text: string | null;
  hero_button_link: string | null;
  home_content: HomeContent | null;
}

export interface AdvantageItem {
  icon: string;
  title: string;
  desc: string;
}

export interface ProcessItem {
  icon: string;
  title: string;
  desc: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface HomeContent {
  heroTag: string;
  heroTags: string[];
  whyTitle: string;
  whySubtitle: string;
  advantages: AdvantageItem[];
  categoriesTitle: string;
  categoriesSubtitle: string;
  featuredTitle: string;
  stats: StatItem[];
  processTitle: string;
  processSubtitle: string;
  process: ProcessItem[];
  aboutTitle: string;
  aboutDesc: string;
  aboutFeatures: string[];
  newsTitle: string;
  newsSubtitle: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaButtonText: string;
  heroSecondaryButton: string;
  viewAllText: string;
  learnMoreText: string;
  readMoreText: string;
  quoteButtonText: string;
}

export function getDefaultHomeContent(): HomeContent {
  return {
    heroTag: 'Premium Manufacturer · Direct Factory',
    heroTags: ['Quality Guaranteed', 'Custom OEM', 'Fast Delivery', 'Global Export'],
    whyTitle: 'Why Choose Us',
    whySubtitle: 'Our Advantages',
    advantages: [
      { icon: 'Leaf', title: 'Premium Raw Materials', desc: 'Verified raw materials matched to every product model, application and order.' },
      { icon: 'Ruler', title: 'Custom Size & Logo', desc: 'Custom dimensions, colors, thickness and full-color logo printing with flexible MOQ.' },
      { icon: 'ShieldCheck', title: 'Strict Quality Control', desc: 'Every batch is inspected against the agreed quality plan and standards.' },
      { icon: 'Truck', title: 'Fast Delivery', desc: 'Lead time confirmed by model, quantity, customization and order requirements.' },
      { icon: 'Globe2', title: 'Global Export Experience', desc: 'Exporting worldwide with full familiarity of regional compliance requirements.' },
      { icon: 'Headset', title: 'Professional Service Team', desc: 'Dedicated account manager, fast response, full follow-up from inquiry to delivery.' },
    ],
    categoriesTitle: 'Our Products',
    categoriesSubtitle: 'Product Range',
    featuredTitle: 'Featured Products',
    stats: [
      { value: '10+', label: 'Years Experience' },
      { value: '100+', label: 'Product Models' },
      { value: '30+', label: 'Export Countries' },
      { value: '500+', label: 'Clients Served' },
      { value: '98%', label: 'On-time Delivery' },
      { value: '24h', label: 'Response Time' },
    ],
    processTitle: 'Production Process',
    processSubtitle: 'From Raw Material to Finished Product — Every Step Strictly Controlled',
    process: [
      { icon: 'Leaf', title: 'Raw Material Sourcing', desc: 'Verified material options selected according to the confirmed model, application and order.' },
      { icon: 'Factory', title: 'Manufacturing', desc: 'Production runs under process control for consistent dimensions and quality.' },
      { icon: 'Printer', title: 'Customization & Printing', desc: 'Color printing follows confirmed artwork and print requirements.' },
      { icon: 'Ruler', title: 'Cutting & Forming', desc: 'Cutting and forming follow confirmed dimensions and tolerances.' },
      { icon: 'ShieldCheck', title: 'Quality Inspection', desc: 'Each batch is checked for strength, print quality and other items under the agreed plan.' },
      { icon: 'Boxes', title: 'Counting & Packing', desc: 'Counting and packing follow confirmed quantities and packing requirements.' },
      { icon: 'Truck', title: 'Export Shipping', desc: 'International logistics coordinated; trade terms confirmed by product.' },
      { icon: 'Headset', title: 'After-sales Service', desc: 'Dedicated follow-up, issues responded within 24 hours, priority support for partners.' },
    ],
    aboutTitle: 'Established Manufacturer, Global Reach',
    aboutDesc: 'We focus on the development, production and export of quality products. Material options, dimensions, thickness, color and printing are confirmed by model, application and order.',
    aboutFeatures: ['Premium materials', 'Custom OEM', 'Quality control', 'Fast delivery'],
    newsTitle: 'News & Updates',
    newsSubtitle: 'Industry Trends · Company News · Product Updates',
    ctaTitle: 'Ready to Work Together?',
    ctaDesc: 'Tell us your needs and we will reply within 24 hours with a professional quote and sample support.',
    ctaButtonText: 'Get In Touch',
    heroSecondaryButton: 'Contact Us',
    viewAllText: 'View All',
    learnMoreText: 'Learn More',
    readMoreText: 'Read More',
    quoteButtonText: 'Request a Quote',
  };
}

export function resolveHomeContent(raw: HomeContent | null | undefined): HomeContent {
  const defaults = getDefaultHomeContent();
  if (!raw) return defaults;
  return {
    ...defaults,
    ...raw,
    advantages: raw.advantages?.length ? raw.advantages : defaults.advantages,
    heroTags: raw.heroTags?.length ? raw.heroTags : defaults.heroTags,
    stats: raw.stats?.length ? raw.stats : defaults.stats,
    process: raw.process?.length ? raw.process : defaults.process,
    aboutFeatures: raw.aboutFeatures?.length ? raw.aboutFeatures : defaults.aboutFeatures,
  };
}

export interface NavLink {
  id: number;
  site_id: number;
  label: string;
  href: string;
  sort_order: number;
  is_active: boolean;
}

export interface Category {
  id: number;
  site_id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  is_active: boolean;
  parent_id: number | null;
}

export interface Product {
  id: number;
  site_id: number;
  category_id: number | null;
  name: string;
  slug: string;
  model: string | null;
  price: string | null;
  main_image: string | null;
  images: string[];
  short_description: string | null;
  description: string | null;
  specifications: any[];
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface Banner {
  id: number;
  site_id: number;
  image: string;
  title: string | null;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface PageData {
  id: number;
  site_id: number;
  slug: string;
  title: string;
  content: any;
  banner_image: string | null;
  is_published: boolean;
}

export const getSiteBySlug = cache(async (slug: string): Promise<Site | null> => {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('sites')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  
  if (error) throw new Error(`获取站点失败: ${error.message}`);
  return data as Site | null;
});

export const getSiteSettings = cache(async (siteId: number): Promise<SiteSettings | null> => {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('site_settings')
    .select('*')
    .eq('site_id', siteId)
    .maybeSingle();
  
  if (error) throw new Error(`获取站点设置失败: ${error.message}`);
  return data as SiteSettings | null;
});

export const getNavLinks = cache(async (siteId: number): Promise<NavLink[]> => {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('nav_links')
    .select('*')
    .eq('site_id', siteId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  
  if (error) throw new Error(`获取导航失败: ${error.message}`);
  return data as NavLink[];
});

export async function getBanners(siteId: number): Promise<Banner[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('banners')
    .select('*')
    .eq('site_id', siteId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  
  if (error) throw new Error(`获取Banner失败: ${error.message}`);
  return data as Banner[];
}

export async function getCategories(siteId: number): Promise<Category[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('categories')
    .select('*')
    .eq('site_id', siteId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  
  if (error) throw new Error(`获取分类失败: ${error.message}`);
  return data as Category[];
}

export async function getFeaturedProducts(siteId: number, limit = 8): Promise<Product[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('site_id', siteId)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit);
  
  if (error) throw new Error(`获取精选产品失败: ${error.message}`);
  return data as Product[];
}

export async function getProducts(siteId: number, categoryId?: number, page = 1, pageSize = 12): Promise<{ data: Product[]; count: number }> {
  const client = getSupabaseClient();
  let query = client
    .from('products')
    .select('*', { count: 'exact' })
    .eq('site_id', siteId)
    .eq('is_active', true);
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  const { data, error, count } = await query
    .order('sort_order', { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1);
  
  if (error) throw new Error(`获取产品失败: ${error.message}`);
  return { data: data as Product[], count: count ?? 0 };
}

export async function getProductById(id: number): Promise<Product | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();
  
  if (error) throw new Error(`获取产品详情失败: ${error.message}`);
  return data as Product | null;
}

export async function getProductBySlug(siteId: number, slug: string): Promise<Product | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('site_id', siteId)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  
  if (error) throw new Error(`获取产品详情失败: ${error.message}`);
  return data as Product | null;
}

export async function getPageBySlug(siteId: number, slug: string): Promise<PageData | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('pages')
    .select('*')
    .eq('site_id', siteId)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  
  if (error) throw new Error(`获取页面失败: ${error.message}`);
  return data as PageData | null;
}

export interface NewsItem {
  id: number;
  site_id: number;
  title: string;
  slug: string;
  category: string;
  cover_image: string | null;
  summary: string | null;
  content: string | null;
  published_at: string;
  is_published: boolean;
  sort_order: number;
}

export async function getNews(siteId: number, limit = 20): Promise<NewsItem[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('news')
    .select('*')
    .eq('site_id', siteId)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  
  if (error) throw new Error(`获取新闻失败: ${error.message}`);
  return data as NewsItem[];
}

export async function getNewsBySlug(siteId: number, slug: string): Promise<NewsItem | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('news')
    .select('*')
    .eq('site_id', siteId)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  
  if (error) throw new Error(`获取新闻详情失败: ${error.message}`);
  return data as NewsItem | null;
}

export async function getAllSites(): Promise<Site[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('sites')
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: true });
  
  if (error) throw new Error(`获取站点列表失败: ${error.message}`);
  return data as Site[];
}
