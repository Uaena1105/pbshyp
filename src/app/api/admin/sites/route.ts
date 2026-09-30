import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getCurrentAdmin } from '@/lib/admin-auth';
import { getTemplateData, TEMPLATES } from '@/lib/site-templates';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: '未登录' }, { status: 401 });
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('sites')
    .select('*')
    .order('id', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sites: data });
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const templateKey = String(body.template ?? 'general').trim();
  const template = TEMPLATES.find((t) => t.key === templateKey) ?? TEMPLATES[3];

  // 名称留空时，按模板自动生成；否则使用用户输入
  const name = String(body.name ?? '').trim() || template.label;
  let slug = String(body.slug ?? '').trim();

  const client = getSupabaseClient();

  // 如果不指定 slug，自动生成数字序号
  if (!slug) {
    const { count } = await client.from('sites').select('*', { count: 'exact', head: true });
    slug = String((count ?? 0) + 1);
  }

  // 检查 slug 唯一性
  const { data: existing } = await client
    .from('sites')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ error: `路径 "${slug}" 已存在，请更换` }, { status: 400 });
  }

  const { data: site, error } = await client
    .from('sites')
    .insert({ name, slug, is_active: true })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const tpl = getTemplateData(templateKey);

  // 1. 站点设置（含首页可变文案 home_content）
  await client.from('site_settings').insert({
    site_id: site.id,
    company_name: name,
    primary_color: '#0A84FF',
    hero_title: tpl.hero_title,
    hero_subtitle: tpl.hero_subtitle,
    hero_image: tpl.hero_image,
    hero_button_text: 'View Products',
    hero_button_link: 'products',
    seo_title: tpl.seo_title,
    seo_description: tpl.seo_description,
    footer_text: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
    home_content: tpl.home_content,
  });

  // 2. 导航
  await client.from('nav_links').insert([
    { site_id: site.id, label: 'Home', href: '', sort_order: 1 },
    { site_id: site.id, label: 'About Us', href: 'about', sort_order: 2 },
    { site_id: site.id, label: 'Products', href: 'products', sort_order: 3 },
    { site_id: site.id, label: 'News', href: 'news', sort_order: 4 },
    { site_id: site.id, label: 'Contact', href: 'contact', sort_order: 5 },
  ]);

  // 3. 轮播
  await client.from('banners').insert(
    tpl.banners.map((b, i) => ({ ...b, site_id: site.id, sort_order: i + 1 })),
  );

  // 4. 分类（先建，拿到 id 关联产品）
  const categoryIds: number[] = [];
  for (const c of tpl.categories) {
    const { data: cat } = await client
      .from('categories')
      .insert({ ...c, site_id: site.id, sort_order: categoryIds.length + 1 })
      .select()
      .single();
    if (cat) categoryIds.push(cat.id);
  }

  // 5. 产品（按序轮流分配到分类）
  await client.from('products').insert(
    tpl.products.map((p, i) => ({
      ...p,
      site_id: site.id,
      category_id: categoryIds.length ? categoryIds[i % categoryIds.length] : null,
      images: [],
      sort_order: i + 1,
    })),
  );

  // 6. 新闻
  await client.from('news').insert(
    tpl.news.map((n, i) => ({
      ...n,
      site_id: site.id,
      is_published: true,
      published_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      sort_order: i + 1,
    })),
  );

  // 7. 默认页面
  await client.from('pages').insert([
    { site_id: site.id, slug: 'home', title: 'Home', content: { sections: ['hero', 'featured', 'categories', 'about_preview'] }, is_published: true },
    { site_id: site.id, slug: 'about', title: 'About Us', content: { title: 'About Us', paragraphs: [], facts: [] }, is_published: true },
    { site_id: site.id, slug: 'contact', title: 'Contact Us', content: { title: 'Contact Us', description: '' }, is_published: true },
  ]);

  return NextResponse.json({ success: true, site });
}