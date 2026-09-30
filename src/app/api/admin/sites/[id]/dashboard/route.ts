import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import {
  getSiteSettings,
  getBanners,
  getCategories,
  getFeaturedProducts,
  getNews,
  getNavLinks,
  getDefaultHomeContent,
} from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const { id } = await params;
  const siteId = Number(id);

  const client = getSupabaseClient();
  const { data: site, error } = await client
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .maybeSingle();

  if (error || !site) {
    return NextResponse.json({ error: '站点不存在' }, { status: 404 });
  }

  const [settings, banners, categories, featuredProducts, news, navLinks] =
    await Promise.all([
      getSiteSettings(siteId),
      getBanners(siteId),
      getCategories(siteId),
      getFeaturedProducts(siteId, 8),
      getNews(siteId, 3),
      getNavLinks(siteId),
    ]);

  const resolvedSettings = settings
    ? { ...settings, home_content: settings.home_content ?? getDefaultHomeContent() }
    : null;

  return NextResponse.json({
    site,
    settings: resolvedSettings,
    banners,
    categories,
    featuredProducts,
    news,
    navLinks,
  });
}