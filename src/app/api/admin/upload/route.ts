import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/admin-auth';
import { getStorage } from '@/lib/storage';
import { sanitizeFileName } from '@/lib/media';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: '未登录' }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: '缺少文件' }, { status: 400 });

  const maxSize = 15 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: '文件过大，最大 15MB' }, { status: 400 });
  }

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const fileName = `uploads/${sanitizeFileName(file.name || 'image')}`;
    const storage = getStorage();
    const key = await storage.uploadFile({
      fileContent: buf,
      fileName,
      contentType: file.type || 'application/octet-stream',
    });

    return NextResponse.json({ success: true, key: `key://${key}`, rawKey: key });
  } catch (err) {
    const message = err instanceof Error ? err.message : '上传失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}