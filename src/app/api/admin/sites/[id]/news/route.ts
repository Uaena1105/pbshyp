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
    .from('news')
    .select('*')
    .eq('site_id', Number(id))
    .order('published_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ news: data });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: '未登录' }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const client = getSupabaseClient();

  const slug = body.slug ?? String(Math.random()).slice(2, 10);
  const { data, error } = await client
    .from('news')
    .insert({
      site_id: Number(id),
      title: body.title,
      slug,
      category: body.category ?? 'company',
      cover_image: body.cover_image ?? null,
      summary: body.summary ?? null,
      content: body.content ?? null,
      published_at: body.published_at ?? new Date().toISOString(),
      is_published: body.is_published ?? true,
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, news: data });
}