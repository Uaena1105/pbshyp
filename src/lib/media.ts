
export function imgSrc(value: string | null | undefined): string {
  if (!value) return '';
  if (value.startsWith('key://')) {
    const key = value.slice('key://'.length);
    return `/api/media/${key}`;
  }
  return value;
}


export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._/\-]/g, '_').replace(/^\/+|\/+$/g, '');
}