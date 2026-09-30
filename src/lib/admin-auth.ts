import { cookies } from 'next/headers';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { createHash, randomBytes } from 'crypto';

export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export async function verifyAdminToken(token: string): Promise<{ id: number; username: string; is_super: boolean } | null> {
  if (!token) return null;
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('admin_sessions')
    .select('admin_id, admins(id, username, is_super), expires_at')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error || !data) return null;
  const admin = (data as any).admins;
  if (!admin) return null;
  return { id: admin.id, username: admin.username, is_super: admin.is_super };
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function createDefaultAdmin() {
  const client = getSupabaseClient();
  const { count, error: countError } = await client
    .from('admins')
    .select('*', { count: 'exact', head: true });

  if (countError) throw countError;

  if ((count ?? 0) === 0) {
    const { error } = await client
      .from('admins')
      .insert({
        username: 'admin',
        password_hash: hashPassword('admin123'),
        is_super: true,
      });
    if (error) throw error;
    console.log('默认管理员已创建: admin / admin123');
  }
}
