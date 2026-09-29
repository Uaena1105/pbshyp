'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Loader2, X } from 'lucide-react';

interface Banner {
  id: number;
  image: string;
  title: string | null;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  sort_order: number;
  is_active: boolean;
}

const empty = { image: '', title: '', subtitle: '', button_text: '', button_link: '', sort_order: 0 };

export function BannersTab({ siteId }: { siteId: number }) {
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/sites/${siteId}/banners`);
    const data = await res.json();
    setItems(data.banners ?? []);
    setLoading(false);
  }, [siteId]);

  useEffect(() => {
    load();
  }, [load]);

  const startAdd = () => {
    setEditingId(null);
    setForm({ ...empty, sort_order: items.length + 1 });
    setShowForm(true);
  };

  const startEdit = (b: Banner) => {
    setEditingId(b.id);
    setShowForm(true);
    setForm({
      image: b.image,
      title: b.title ?? '',
      subtitle: b.subtitle ?? '',
      button_text: b.button_text ?? '',
      button_link: b.button_link ?? '',
      sort_order: b.sort_order,
    });
  };

  const handleSave = async () => {
    if (!form.image) return alert('请填写图片 URL');
    setSaving(true);
    if (editingId) {
      await fetch(`/api/admin/banners/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`/api/admin/sites/${siteId}/banners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    setEditingId(null);
    setForm(empty);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此轮播图？')) return;
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">轮播图管理</h2>
        <button
          onClick={startAdd}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          新增
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">
              {editingId ? '编辑轮播图' : '新增轮播图'}
            </span>
            <button onClick={() => { setEditingId(null); setForm(empty); setShowForm(false); }} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">图片 URL *</label>
              <input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">标题</label>
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">副标题</label>
              <input value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">按钮文字</label>
              <input value={form.button_text} onChange={(e) => setForm((p) => ({ ...p, button_text: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">按钮链接</label>
              <input value={form.button_link} onChange={(e) => setForm((p) => ({ ...p, button_link: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm" />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="mt-3 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : '保存'}
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => (
          <div key={b.id} className="overflow-hidden rounded-lg border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.image} alt={b.title ?? ''} className="h-32 w-full object-cover" />
            <div className="p-3">
              <div className="truncate text-sm font-semibold text-slate-900">{b.title ?? '未命名'}</div>
              <div className="mt-1 truncate text-xs text-slate-400">{b.subtitle}</div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => startEdit(b)} className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                  <Pencil className="h-3.5 w-3.5" /> 编辑
                </button>
                <button onClick={() => handleDelete(b.id)} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" /> 删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}