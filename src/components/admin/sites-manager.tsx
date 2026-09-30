'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  ExternalLink,
  Pencil,
  Loader2,
  Globe,
  Package,
  Cpu,
  Sofa,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

interface Site {
  id: number;
  slug: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface TemplateMeta {
  key: string;
  label: string;
  icon: string;
  description: string;
}

const TEMPLATES: TemplateMeta[] = [
  { key: 'plastic', label: '塑料包装', icon: 'Package', description: '塑料制品、包装袋、薄膜等外贸工厂' },
  { key: 'electronics', label: '电子产品', icon: 'Cpu', description: '消费电子、配件、智能设备' },
  { key: 'home', label: '家居用品', icon: 'Sofa', description: '家居、厨具、生活用品' },
  { key: 'general', label: '通用外贸', icon: 'Globe', description: '任意行业通用企业官网' },
];

const ICONS: Record<string, LucideIcon> = { Package, Cpu, Sofa, Globe };

export function SitesManager() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingKey, setCreatingKey] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [domain, setDomain] = useState('');

  useEffect(() => {
    setDomain(window.location.origin);
  }, []);

  const loadSites = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sites');
      const data = await res.json();
      if (res.ok) setSites(data.sites ?? []);
      else setError(data.error ?? '加载失败');
    } catch {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSites();
  }, [loadSites]);

  const handleCreate = useCallback(
    async (templateKey: string) => {
      setCreatingKey(templateKey);
      setError('');
      try {
        const res = await fetch('/api/admin/sites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ template: templateKey, name }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? '创建失败');
          return;
        }
        // 创建成功后直接进入可视化编辑
        router.push(`/admin/sites/edit?id=${data.site.id}`);
      } catch {
        setError('网络错误');
      } finally {
        setCreatingKey(null);
      }
    },
    [name, router],
  );

  const handleDelete = async (site: Site) => {
    if (!confirm(`确定删除站点「${site.name}」？此操作不可撤销，将删除其所有内容。`)) return;
    const res = await fetch(`/api/admin/sites/${site.id}`, { method: 'DELETE' });
    if (res.ok) loadSites();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">站点管理</h1>
        <p className="mt-1 text-sm text-slate-500">
          选择一个行业模板，一键创建独立站，创建后即可在可视化编辑器里点击修改所有文字和图片。
        </p>
      </div>

      {/* 一键创建 */}
      <div className="glass-card mb-8 rounded-3xl p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-2 font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            选择模板，一键创建新站
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-500">站点名称（可选）</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="留空则使用模板名"
              className="h-10 w-52 rounded-full border border-slate-200 bg-white/70 px-4 text-sm text-foreground outline-none backdrop-blur transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((t) => {
            const Icon = ICONS[t.icon] ?? Globe;
            const busy = creatingKey === t.key;
            return (
              <button
                key={t.key}
                onClick={() => handleCreate(t.key)}
                disabled={creatingKey !== null}
                className="glass group relative flex flex-col items-start rounded-2xl p-5 text-left transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-all group-hover:bg-primary group-hover:text-white">
                  {busy ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <Icon className="h-5 w-5 text-primary transition-colors group-hover:text-white" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 font-semibold tracking-tight text-foreground">
                  {t.label}
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{t.description}</p>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* 站点列表 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-foreground">
          我的站点 <span className="ml-1 text-sm font-normal text-slate-400">{sites.length}</span>
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : sites.length === 0 ? (
        <div className="glass-card rounded-3xl py-16 text-center text-slate-400">
          <Globe className="mx-auto h-10 w-10" />
          <p className="mt-3">还没有站点，点击上方模板一键创建</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <div key={site.id} className="glass-card rounded-3xl p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="truncate font-semibold tracking-tight text-foreground">
                    {site.name}
                  </div>
                  <div className="mt-1 truncate text-xs text-slate-500">
                    {domain ?? ''}/{site.slug}
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600">
                  {site.is_active ? '已启用' : '已停用'}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <Link
                  href={`/admin/sites/edit?id=${site.id}`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  可视化编辑
                </Link>
                <Link
                  href={`/${site.slug}`}
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-white"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={() => handleDelete(site)}
                  className="inline-flex items-center justify-center rounded-full border border-red-200 px-2.5 py-2 text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}