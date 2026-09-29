'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';

const fields: { key: string; label: string; type?: string }[] = [
  { key: 'company_name', label: '公司名称' },
  { key: 'logo_url', label: 'Logo 图片 URL' },
  { key: 'favicon_url', label: 'Favicon URL' },
  { key: 'whatsapp', label: 'WhatsApp 号码' },
  { key: 'phone', label: '电话' },
  { key: 'email', label: '邮箱' },
  { key: 'address', label: '地址' },
  { key: 'seo_title', label: 'SEO 标题' },
  { key: 'seo_description', label: 'SEO 描述' },
  { key: 'seo_keywords', label: 'SEO 关键词' },
  { key: 'footer_text', label: '页脚版权文本' },
  { key: 'primary_color', label: '主题色 (十六进制)' },
  { key: 'hero_title', label: '首页主标题' },
  { key: 'hero_subtitle', label: '首页副标题' },
  { key: 'hero_image', label: '首页主图 URL' },
  { key: 'hero_button_text', label: '首页按钮文字' },
  { key: 'hero_button_link', label: '首页按钮链接' },
];

export function SettingsTab({ siteId }: { siteId: number }) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`/api/admin/sites/${siteId}/settings`)
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          const init: Record<string, string> = {};
          for (const f of fields) init[f.key] = data.settings[f.key] ?? '';
          setForm(init);
        }
      })
      .finally(() => setLoading(false));
  }, [siteId]);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    const res = await fetch(`/api/admin/sites/${siteId}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    setMsg(res.ok ? '保存成功' : data.error ?? '保存失败');
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
        <h2 className="font-semibold text-slate-900">基础信息设置</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          保存
        </button>
      </div>
      {msg && (
        <div className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{msg}</div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className={f.key === 'address' || f.key === 'seo_description' || f.key === 'hero_subtitle' ? 'sm:col-span-2' : ''}>
            <label className="mb-1 block text-sm font-medium text-slate-700">{f.label}</label>
            {f.key === 'address' || f.key === 'seo_description' || f.key === 'hero_subtitle' ? (
              <textarea
                rows={2}
                value={form[f.key] ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            ) : (
              <input
                value={form[f.key] ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}