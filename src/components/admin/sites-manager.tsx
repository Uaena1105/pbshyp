'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, ExternalLink, Settings, Loader2, Globe } from 'lucide-react';

interface Site {
  id: number;
  slug: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export function SitesManager() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [creating, setCreating] = useState(false);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/admin/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '创建失败');
        return;
      }
      setName('');
      setSlug('');
      loadSites();
    } catch {
      setError('网络错误');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (site: Site) => {
    if (!confirm(`确定删除站点「${site.name}」？此操作不可撤销，将删除其所有内容。`)) return;
    const res = await fetch(`/api/admin/sites/${site.id}`, { method: 'DELETE' });
    if (res.ok) loadSites();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">站点管理</h1>
          <p className="mt-1 text-sm text-slate-500">
            创建和管理你的所有前端站点，每个站点拥有独立路径
          </p>
        </div>
      </div>

      {/* 创建站点 */}
      <div className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-slate-900">创建新站点</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">站点名称</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              placeholder="例如：电子科技"
              required
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              自定义路径（可选，留空自动编号）
            </label>
            <div className="flex items-center rounded-md border border-slate-300 focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900">
              <span className="pl-3 text-sm text-slate-400">{domain ?? ''}/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-r-md px-1 py-2.5 text-sm focus:outline-none"
                placeholder="my-site"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            创建站点
          </button>
        </form>
        {error && <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
      </div>

      {/* 站点列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : sites.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 py-16 text-center text-slate-400">
          <Globe className="mx-auto h-10 w-10" />
          <p className="mt-3">还没有站点，点击上方创建一个</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <div key={site.id} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">{site.name}</div>
                  <div className="mt-1 text-xs text-slate-400">路径：/{site.slug}</div>
                </div>
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                  {site.is_active ? '已启用' : '已停用'}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={`/admin/sites/${site.id}`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  <Settings className="h-3.5 w-3.5" />
                  编辑内容
                </Link>
                <Link
                  href={`/${site.slug}`}
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={() => handleDelete(site)}
                  className="inline-flex items-center justify-center rounded-md border border-red-200 px-2.5 py-2 text-red-600 hover:bg-red-50"
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