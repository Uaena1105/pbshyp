'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Loader2, X } from 'lucide-react';

interface Product {
  id: number;
  category_id: number | null;
  name: string;
  slug: string;
  model: string | null;
  price: string | null;
  main_image: string | null;
  short_description: string | null;
  description: string | null;
  specifications: { name: string; value: string }[];
  is_featured: boolean;
  sort_order: number;
}

const empty = {
  category_id: null as number | null,
  name: '',
  model: '',
  price: '',
  main_image: '',
  short_description: '',
  description: '',
  specsText: '',
  is_featured: false,
  sort_order: 0,
};

export function ProductsTab({ siteId }: { siteId: number }) {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [pRes, cRes] = await Promise.all([
      fetch(`/api/admin/sites/${siteId}/products`),
      fetch(`/api/admin/sites/${siteId}/categories`),
    ]);
    const pData = await pRes.json();
    const cData = await cRes.json();
    setItems(pData.products ?? []);
    setCategories(cData.categories ?? []);
    setLoading(false);
  }, [siteId]);

  useEffect(() => {
    load();
  }, [load]);

  const specsToText = (specs: { name: string; value: string }[]) =>
    specs.map((s) => `${s.name}: ${s.value}`).join('\n');

  const startAdd = () => {
    setEditingId(null);
    setForm({ ...empty, sort_order: items.length + 1 });
    setShowForm(true);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      category_id: p.category_id,
      name: p.name,
      model: p.model ?? '',
      price: p.price ?? '',
      main_image: p.main_image ?? '',
      short_description: p.short_description ?? '',
      description: p.description ?? '',
      specsText: specsToText(p.specifications ?? []),
      is_featured: p.is_featured,
      sort_order: p.sort_order,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name) return alert('请填写产品名称');
    const specs = form.specsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const idx = line.indexOf(':');
        if (idx === -1) return { name: line, value: '' };
        return { name: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
      });

    const payload = {
      category_id: form.category_id,
      name: form.name,
      model: form.model,
      price: form.price,
      main_image: form.main_image,
      short_description: form.short_description,
      description: form.description,
      specifications: specs,
      is_featured: form.is_featured,
      sort_order: form.sort_order,
    };

    setSaving(true);
    if (editingId) {
      await fetch(`/api/admin/products/${editingId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
    } else {
      await fetch(`/api/admin/sites/${siteId}/products`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    setEditingId(null);
    setForm(empty);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此产品？')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
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
        <h2 className="font-semibold text-slate-900">产品管理</h2>
        <button onClick={startAdd} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" /> 新增
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">{editingId ? '编辑产品' : '新增产品'}</span>
            <button onClick={() => { setEditingId(null); setForm(empty); setShowForm(false); }} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">产品名称 *</label>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">所属分类</label>
              <select value={form.category_id ?? ''} onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value ? Number(e.target.value) : null }))} className={inputClass}>
                <option value="">未分类</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">型号</label>
              <input value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">价格</label>
              <input value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">主图 URL</label>
              <input value={form.main_image} onChange={(e) => setForm((p) => ({ ...p, main_image: e.target.value }))} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">简介</label>
              <textarea rows={2} value={form.short_description} onChange={(e) => setForm((p) => ({ ...p, short_description: e.target.value }))} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">详细描述</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">规格参数（每行一条，格式：名称: 值）</label>
              <textarea rows={4} value={form.specsText} onChange={(e) => setForm((p) => ({ ...p, specsText: e.target.value }))} placeholder={'Material: HDPE\nSize: Custom'} className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))} />
                设为推荐产品
              </label>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : '保存'}
          </button>
        </div>
      )}

      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
        {items.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-3 p-4">
            <div className="flex min-w-0 items-center gap-3">
              {p.main_image && (

                <img src={p.main_image} alt={p.name} className="h-12 w-12 rounded-md object-cover" />
              )}
              <div className="min-w-0">
                <div className="truncate font-medium text-slate-900">{p.name}</div>
                <div className="mt-0.5 text-xs text-slate-400">{p.model ?? ''}</div>
              </div>
              {p.is_featured && (
                <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">推荐</span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => startEdit(p)} className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                <Pencil className="h-3.5 w-3.5" /> 编辑
              </button>
              <button onClick={() => handleDelete(p.id)} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" /> 删除
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="py-10 text-center text-sm text-slate-400">暂无产品</div>}
      </div>
    </div>
  );
}