import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getCurrentAdmin } from '@/lib/admin-auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const { id } = await params;
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('site_settings')
    .select('*')
    .eq('site_id', Number(id))
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const client = getSupabaseClient();

  const allowed = [
    'company_name', 'logo_url', 'favicon_url', 'whatsapp', 'phone', 'email', 'address',
    'seo_title', 'seo_description', 'seo_keywords', 'footer_text', 'primary_color',
    'hero_title', 'hero_subtitle', 'hero_image', 'hero_button_text', 'hero_button_link',
  ];

  const patch: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) patch[key] = body[key] === '' ? null : body[key];
  }

  const { data, error } = await client
    .from('site_settings')
    .update(patch)
    .eq('site_id', Number(id))
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, settings: data });
}