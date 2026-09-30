/**
 * 图片字段值 → 可访问 URL。
 * 字段约定：以 `key://` 前缀存储对象 key（持久化存 key，避免签名 URL 过期失效），
 * 外部图床 URL 则原样返回。
 *
 * 注意：本文件必须是「纯函数、无服务端依赖」，因为会被客户端组件（editor.tsx）引用。
 * 对象存储客户端初始化请见 lib/storage.ts（仅服务端使用）。
 */
export function imgSrc(value: string | null | undefined): string {
  if (!value) return '';
  if (value.startsWith('key://')) {
    const key = value.slice('key://'.length);
    return `/api/media/${key}`;
  }
  return value;
}

/** 清洗上传文件名，仅保留合法字符 */
export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._/\-]/g, '_').replace(/^\/+|\/+$/g, '');
}