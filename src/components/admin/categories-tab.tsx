'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Loader2, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  is_active: boolean;
}

const empty = { name: '', description: '', image: '', sort_order: 0 };

export function CategoriesTab({ siteId }: { siteId: number }) {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/sites/${siteId}/categories`);
    const data = await res.json();
    setItems(data.categories ?? []);
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

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setForm({ name: c.name, description: c.description ?? '', image: c.image ?? '', sort_order: c.sort_order });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name) return alert('请填写分类名称');
    setSaving(true);
    if (editingId) {
      await fetch(`/api/admin/categories/${editingId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
    } else {
      await fetch(`/api/admin/sites/${siteId}/categories`, {
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
    if (!confirm('确定删除此分类？该分类下的产品将变为未分类。')) return;
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
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
        <h2 className="font-semibold text-slate-900">分类管理</h2>
        <button onClick={startAdd} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" /> 新增
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">{editingId ? '编辑分类' : '新增分类'}</span>
            <button onClick={() => { setEditingId(null); setForm(empty); setShowForm(false); }} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">名称 *</label>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">图片 URL</label>
              <input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">描述</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm" />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="mt-3 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : '保存'}
          </button>
        </div>
      )}

      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
        {items.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-3 p-4">
            <div>
              <div className="font-medium text-slate-900">{c.name}</div>
              <div className="mt-0.5 text-xs text-slate-400">/{c.slug}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => startEdit(c)} className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                <Pencil className="h-3.5 w-3.5" /> 编辑
              </button>
              <button onClick={() => handleDelete(c.id)} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" /> 删除
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="py-10 text-center text-sm text-slate-400">暂无分类</div>}
      </div>
    </div>
  );
}