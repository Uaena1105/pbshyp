import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { requireAdmin } from '@/lib/admin-request';
import { getCurrentAdmin } from '@/lib/admin-auth';

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
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const body = await request.json();
  const name = String(body.name ?? '').trim();
  let slug = String(body.slug ?? '').trim();

  if (!name) return NextResponse.json({ error: '站点名称不能为空' }, { status: 400 });

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

  // 初始化新站点的设置、导航和默认页面
  await client.from('site_settings').insert({
    site_id: site.id,
    company_name: name,
    primary_color: '#1e40af',
    hero_title: name,
    hero_subtitle: 'Your trusted partner',
    hero_button_text: 'View Products',
    hero_button_link: 'products',
    footer_text: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
  });

  await client.from('nav_links').insert([
    { site_id: site.id, label: 'Home', href: '', sort_order: 1 },
    { site_id: site.id, label: 'About Us', href: 'about', sort_order: 2 },
    { site_id: site.id, label: 'Products', href: 'products', sort_order: 3 },
    { site_id: site.id, label: 'Contact', href: 'contact', sort_order: 4 },
  ]);

  await client.from('pages').insert([
    { site_id: site.id, slug: 'home', title: 'Home', content: { sections: ['hero', 'featured', 'categories'] }, is_published: true },
    { site_id: site.id, slug: 'about', title: 'About Us', content: { title: 'About Us', paragraphs: [], facts: [] }, is_published: true },
    { site_id: site.id, slug: 'contact', title: 'Contact Us', content: { title: 'Contact Us', description: '' }, is_published: true },
  ]);

  return NextResponse.json({ success: true, site });
}