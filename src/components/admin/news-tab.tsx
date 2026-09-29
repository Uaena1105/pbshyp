'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Loader2, X } from 'lucide-react';

interface News {
  id: number;
  title: string;
  slug: string;
  category: string;
  cover_image: string | null;
  summary: string | null;
  content: string | null;
  is_published: boolean;
}

const empty = { title: '', category: 'company', cover_image: '', summary: '', content: '', is_published: true };

export function NewsTab({ siteId }: { siteId: number }) {
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/sites/${siteId}/news`);
    const data = await res.json();
    setItems(data.news ?? []);
    setLoading(false);
  }, [siteId]);

  useEffect(() => {
    load();
  }, [load]);

  const startAdd = () => {
    setEditingId(null);
    setForm(empty);
    setShowForm(true);
  };

  const startEdit = (n: News) => {
    setEditingId(n.id);
    setForm({
      title: n.title,
      category: n.category,
      cover_image: n.cover_image ?? '',
      summary: n.summary ?? '',
      content: n.content ?? '',
      is_published: n.is_published,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title) return alert('请填写新闻标题');
    setSaving(true);
    if (editingId) {
      await fetch(`/api/admin/news/${editingId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
    } else {
      await fetch(`/api/admin/sites/${siteId}/news`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
    }
    setSaving(false);
    setEditingId(null);
    setForm(empty);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此新闻？')) return;
    await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const inputClass = 'w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900';

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">新闻管理</h2>
        <button onClick={startAdd} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" /> 新增
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">{editingId ? '编辑新闻' : '新增新闻'}</span>
            <button onClick={() => { setEditingId(null); setForm(empty); setShowForm(false); }} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">标题 *</label>
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">分类</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className={inputClass}>
                <option value="company">Company News</option>
                <option value="industry">Industry News</option>
                <option value="product">Product Updates</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">封面图 URL</label>
              <input value={form.cover_image} onChange={(e) => setForm((p) => ({ ...p, cover_image: e.target.value }))} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">摘要</label>
              <textarea rows={2} value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">正文内容</label>
              <textarea rows={5} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))} />
                发布
              </label>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : '保存'}
          </button>
        </div>
      )}

      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
        {items.map((n) => (
          <div key={n.id} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <div className="truncate font-medium text-slate-900">{n.title}</div>
              <div className="mt-0.5 text-xs text-slate-400">{n.category}</div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => startEdit(n)} className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                <Pencil className="h-3.5 w-3.5" /> 编辑
              </button>
              <button onClick={() => handleDelete(n.id)} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" /> 删除
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="py-10 text-center text-sm text-slate-400">暂无新闻</div>}
      </div>
    </div>
  );
}