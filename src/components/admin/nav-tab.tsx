'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Loader2, X } from 'lucide-react';

interface NavItem {
  id: number;
  label: string;
  href: string;
  sort_order: number;
  is_active: boolean;
}

const empty = { label: '', href: '', sort_order: 0 };

export function NavTab({ siteId }: { siteId: number }) {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/sites/${siteId}/nav`);
    const data = await res.json();
    setItems(data.nav ?? []);
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

  const startEdit = (n: NavItem) => {
    setEditingId(n.id);
    setForm({ label: n.label, href: n.href, sort_order: n.sort_order });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.label) return alert('请填写导航文字');
    setSaving(true);
    if (editingId) {
      await fetch(`/api/admin/nav/${editingId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
    } else {
      await fetch(`/api/admin/sites/${siteId}/nav`, {
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
    if (!confirm('确定删除此导航？')) return;
    await fetch(`/api/admin/nav/${id}`, { method: 'DELETE' });
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
        <h2 className="font-semibold text-slate-900">导航菜单管理</h2>
        <button onClick={startAdd} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" /> 新增
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">{editingId ? '编辑导航' : '新增导航'}</span>
            <button onClick={() => { setEditingId(null); setForm(empty); setShowForm(false); }} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">文字 *</label>
              <input value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">链接（站内相对路径）</label>
              <input value={form.href} onChange={(e) => setForm((p) => ({ ...p, href: e.target.value }))} placeholder="about / products / contact" className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">排序序号</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))} className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm" />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="mt-3 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : '保存'}
          </button>
        </div>
      )}

      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
        {items.map((n) => (
          <div key={n.id} className="flex items-center justify-between gap-3 p-4">
            <div>
              <div className="font-medium text-slate-900">{n.label}</div>
              <div className="mt-0.5 text-xs text-slate-400">链接：{n.href || '/'}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => startEdit(n)} className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                <Pencil className="h-3.5 w-3.5" /> 编辑
              </button>
              <button onClick={() => handleDelete(n.id)} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" /> 删除
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="py-10 text-center text-sm text-slate-400">暂无导航</div>}
      </div>
    </div>
  );
}