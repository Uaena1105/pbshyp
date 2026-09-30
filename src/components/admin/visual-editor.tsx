'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Upload,
  Link2,
  Pencil,
  Check,
  Sparkles,
} from 'lucide-react';
import { EditorProvider, type EditRequest } from '@/components/site/editor';
import { SiteHeader } from '@/components/site/site-header';
import { HomeContent } from '@/components/site/home-content';
import { SiteFooter } from '@/components/site/site-footer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { imgSrc } from '@/lib/media';
import type {
  Site,
  SiteSettings,
  Banner,
  Category,
  Product,
  NewsItem,
  NavLink,
  HomeContent as HomeContentType,
} from '@/lib/site-data';

interface Dashboard {
  site: Site;
  settings: SiteSettings | null;
  banners: Banner[];
  categories: Category[];
  featuredProducts: Product[];
  news: NewsItem[];
  navLinks: NavLink[];
}

/** settings field（camelCase）→ 数据库列名（snake_case） */
const SETTINGS_FIELDS: Record<string, string> = {
  companyName: 'company_name',
  logo: 'logo_url',
  heroTitle: 'hero_title',
  heroSubtitle: 'hero_subtitle',
  heroButtonText: 'hero_button_text',
  heroImage: 'hero_image',
  seoDescription: 'seo_description',
  footerText: 'footer_text',
};

function deepSet<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: string,
): T {
  const clone = structuredClone(obj);
  const parts = path.split('.');
  let cur: Record<string, unknown> = clone as unknown as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (cur[key] === undefined || cur[key] === null) {
      cur[key] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    }
    cur = cur[key] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
  return clone;
}

export function VisualEditor({
  siteId,
  siteName,
  slug,
}: {
  siteId: number;
  siteName: string;
  slug: string;
}) {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 编辑对话框状态
  const [req, setReq] = useState<EditRequest | null>(null);
  const [draft, setDraft] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/sites/${siteId}/dashboard`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('加载失败');
      const json = (await res.json()) as Dashboard;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    load();
  }, [load]);

  const persist = useCallback(
    async (field: string, value: string) => {
      setSaving(true);
      setError(null);
      setSaved(false);
      try {
        if (field.startsWith('settings.')) {
          const key = field.slice('settings.'.length);
          const column = SETTINGS_FIELDS[key] ?? key;
          await fetch(`/api/admin/sites/${siteId}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [column]: value }),
          });
        } else if (field.startsWith('home.')) {
          const raw = data?.settings?.home_content ?? null;
          const home = raw ?? ({} as HomeContentType);
          const path = field.slice('home.'.length);
          const next = deepSet(home as unknown as Record<string, unknown>, path, value);
          await fetch(`/api/admin/sites/${siteId}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ home_content: next }),
          });
        } else if (field.startsWith('category.')) {
          const [, id, key] = field.split('.');
          const column =
            key === 'description'
              ? 'description'
              : key === 'image'
                ? 'image'
                : 'name';
          await fetch(`/api/admin/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [column]: value }),
          });
        } else if (field.startsWith('product.')) {
          const [, id, key] = field.split('.');
          const column =
            key === 'mainImage'
              ? 'main_image'
              : key === 'shortDescription'
                ? 'short_description'
                : 'name';
          await fetch(`/api/admin/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [column]: value }),
          });
        } else if (field.startsWith('banner.')) {
          const [, id, key] = field.split('.');
          await fetch(`/api/admin/banners/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [key === 'image' ? 'image' : 'title']: value }),
          });
        } else if (field.startsWith('news.')) {
          const [, id, key] = field.split('.');
          const column =
            key === 'coverImage'
              ? 'cover_image'
              : key === 'summary'
                ? 'summary'
                : 'title';
          await fetch(`/api/admin/news/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [column]: value }),
          });
        } else {
          throw new Error('未知字段');
        }
        setSaved(true);
        await load();
      } catch (err) {
        setError(err instanceof Error ? err.message : '保存失败');
      } finally {
        setSaving(false);
      }
    },
    [data, siteId, load],
  );

  const edit = useCallback((r: EditRequest) => {
    setReq(r);
    setDraft(r.value);
    setError(null);
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    if (!req) return;
    void persist(req.field, draft);
  }, [req, draft, persist]);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = (await res.json()) as { success?: boolean; key?: string; error?: string };
      if (!res.ok || !json.success || !json.key) {
        throw new Error(json.error ?? '上传失败');
      }
      setDraft(json.key);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
    } finally {
      setUploading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        正在加载站点预览…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-slate-500">
        <p>{error ?? '站点数据为空'}</p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          返回站点列表
        </Link>
      </div>
    );
  }

  return (
    <EditorProvider editable edit={edit}>
      {/* 提示条 */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 backdrop-blur">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          <Pencil className="h-4 w-4" />
          把鼠标移到文字或图片上，点击出现的铅笔图标即可编辑
        </span>
        <div className="flex items-center gap-2.5">
          {saving && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              保存中
            </span>
          )}
          {saved && !saving && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <Check className="h-3.5 w-3.5" />
              已保存
            </span>
          )}
        </div>
      </div>

      {/* 站点预览（复用真实前台组件） */}
      <div className="rounded-[2rem] border border-white/60 bg-background/70 shadow-[0_12px_44px_rgba(10,84,255,0.08)] backdrop-blur-xl">
        <SiteHeader slug={slug} settings={data.settings} navLinks={data.navLinks} />
        <HomeContent
          slug={slug}
          settings={data.settings}
          banners={data.banners}
          categories={data.categories}
          featuredProducts={data.featuredProducts}
          news={data.news}
          home={data.settings?.home_content ?? ({} as HomeContentType)}
        />
        <SiteFooter slug={slug} settings={data.settings} navLinks={data.navLinks} />
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* 内联编辑对话框 */}
      <Dialog open={!!req} onOpenChange={(o) => !o && setReq(null)}>
        <DialogContent className="glass-card rounded-[1.5rem] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              编辑{req?.kind === 'image' ? '图片' : '内容'}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              修改「{req?.label}」后保存，前台将实时更新。
            </DialogDescription>
          </DialogHeader>

          {req?.kind === 'image' ? (
            <div className="space-y-4">
              <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                {draft ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imgSrc(draft)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm text-slate-400">暂无图片</span>
                )}
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-6 text-center transition-colors hover:border-primary/40 hover:bg-primary/5">
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : (
                  <Upload className="h-5 w-5 text-primary" />
                )}
                <span className="text-sm font-medium text-slate-600">
                  {uploading ? '上传中…' : '点击上传本地图片'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleUpload(f);
                  }}
                />
              </label>

              <div className="flex items-center gap-2">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">或</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  value={draft.startsWith('key://') ? '' : draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="粘贴图片地址（https://…）"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white/70 px-3 text-sm text-foreground outline-none backdrop-blur transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {req?.kind === 'textarea' ? (
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-slate-200 bg-white/70 px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none backdrop-blur transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              ) : (
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white/70 px-3 text-sm text-foreground outline-none backdrop-blur transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              )}
            </div>
          )}

          <DialogFooter>
            <button
              type="button"
              onClick={() => setReq(null)}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              保存
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EditorProvider>
  );
}