import { NextResponse } from 'next/server';
import { getStorage } from '@/lib/storage';

export const runtime = 'nodejs';


export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params;
  const fileKey = (key ?? []).join('/');
  if (!fileKey) return NextResponse.json({ error: '缺少 key' }, { status: 400 });

  try {
    const storage = getStorage();
    const url = await storage.generatePresignedUrl({ key: fileKey, expireTime: 3600 });
    return NextResponse.redirect(url);
  } catch {
    return NextResponse.json({ error: '资源不存在或不可访问' }, { status: 404 });
  }
}