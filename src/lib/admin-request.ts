import { verifyAdminToken } from './admin-auth';

export type AdminUser = { id: number; username: string; is_super: boolean };

export function getTokenFromRequest(req: Request): string | null {
  const cookie = req.headers.get('cookie') ?? '';
  const match = cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function requireAdmin(req: Request): Promise<AdminUser | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyAdminToken(token);
}