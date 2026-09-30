import { NextResponse } from 'next/server';
import { getStorage } from '@/lib/storage';

export const runtime = 'nodejs';

/**
 * 对象存储图片代理：根据 key 动态生成签名 URL 并 302 重定向。
 * 持久化字段仅存 key，此处按需生成短时签名链接，避免 URL 过期失效。
 */
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