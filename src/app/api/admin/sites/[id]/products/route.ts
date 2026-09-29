import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getCurrentAdmin } from '@/lib/admin-auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: '未登录' }, { status: 401 });
  const { id } = await params;
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') ?? '1');
  const pageSize = Number(url.searchParams.get('pageSize') ?? '50');

  const client = getSupabaseClient();
  const { data, error, count } = await client
    .from('products')
    .select('*', { count: 'exact' })
    .eq('site_id', Number(id))
    .order('sort_order', { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data, count: count ?? 0 });
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
    .from('products')
    .insert({
      site_id: Number(id),
      category_id: body.category_id ?? null,
      name: body.name,
      slug,
      model: body.model ?? null,
      price: body.price ?? null,
      main_image: body.main_image ?? null,
      images: body.images ?? [],
      short_description: body.short_description ?? null,
      description: body.description ?? null,
      specifications: body.specifications ?? [],
      sort_order: body.sort_order ?? 0,
      is_active: body.is_active ?? true,
      is_featured: body.is_featured ?? false,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, product: data });
}