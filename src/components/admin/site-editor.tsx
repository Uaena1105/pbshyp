'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { SettingsTab } from './settings-tab';
import { BannersTab } from './banners-tab';
import { CategoriesTab } from './categories-tab';
import { ProductsTab } from './products-tab';
import { NewsTab } from './news-tab';
import { NavTab } from './nav-tab';

const tabs = [
  { key: 'settings', label: '基础信息' },
  { key: 'banners', label: '轮播图' },
  { key: 'categories', label: '分类' },
  { key: 'products', label: '产品' },
  { key: 'news', label: '新闻' },
  { key: 'nav', label: '导航' },
] as const;

type TabKey = (typeof tabs)[number]['key'];

export function SiteEditor({ siteId, siteName, slug }: { siteId: number; siteName: string; slug: string }) {
  const [tab, setTab] = useState<TabKey>('settings');

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{siteName}</h1>
            <p className="text-xs text-slate-500">站点路径：/{slug}</p>
          </div>
        </div>
        <Link
          href={`/${slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <ExternalLink className="h-4 w-4" />
          预览站点
        </Link>
      </div>

      {/* Tab 切换 */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        {tab === 'settings' && <SettingsTab siteId={siteId} />}
        {tab === 'banners' && <BannersTab siteId={siteId} />}
        {tab === 'categories' && <CategoriesTab siteId={siteId} />}
        {tab === 'products' && <ProductsTab siteId={siteId} />}
        {tab === 'news' && <NewsTab siteId={siteId} />}
        {tab === 'nav' && <NavTab siteId={siteId} />}
      </div>
    </div>
  );
}