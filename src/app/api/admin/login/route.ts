import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { hashPassword, generateToken } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const client = getSupabaseClient();
  try {
    const body = await request.json();
    const username = String(body.username ?? '').trim();
    const password = String(body.password ?? '');

    if (!username || !password) {
      return NextResponse.json({ error: '请输入用户名和密码' }, { status: 400 });
    }

    const { data: admin, error } = await client
      .from('admins')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error || !admin) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    if (admin.password_hash !== hashPassword(password)) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await client.from('admin_sessions').insert({
      admin_id: admin.id,
      token,
      expires_at: expiresAt,
    });

    const response = NextResponse.json({ success: true, username: admin.username });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}