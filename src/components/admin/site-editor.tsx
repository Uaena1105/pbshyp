'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Pencil, SlidersHorizontal } from 'lucide-react';
import { VisualEditor } from './visual-editor';
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

export function SiteEditor({
  siteId,
  siteName,
  slug,
}: {
  siteId: number;
  siteName: string;
  slug: string;
}) {
  const [view, setView] = useState<'visual' | 'advanced'>('visual');
  const [tab, setTab] = useState<TabKey>('settings');

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/70 bg-white/60 px-3.5 py-2 text-sm text-slate-600 backdrop-blur transition-colors hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">{siteName}</h1>
            <p className="text-xs text-slate-500">站点路径：/{slug}</p>
          </div>
        </div>

        <Link
          href={`/${slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35"
        >
          <ExternalLink className="h-4 w-4" />
          预览前台
        </Link>
      </div>


      <div className="glass mb-6 flex gap-1 rounded-full p-1">
        <button
          onClick={() => setView('visual')}
          className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
            view === 'visual'
              ? 'bg-primary text-white shadow-lg shadow-primary/30'
              : 'text-slate-600 hover:bg-white/70'
          }`}
        >
          <Pencil className="h-4 w-4" />
          可视化编辑
        </button>
        <button
          onClick={() => setView('advanced')}
          className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
            view === 'advanced'
              ? 'bg-primary text-white shadow-lg shadow-primary/30'
              : 'text-slate-600 hover:bg-white/70'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          高级管理
        </button>
      </div>

      {view === 'visual' ? (
        <VisualEditor siteId={siteId} siteName={siteName} slug={slug} />
      ) : (
        <div>
          <div className="glass mb-6 flex gap-1 overflow-x-auto rounded-full p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.key
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-white/70'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-5">
            {tab === 'settings' && <SettingsTab siteId={siteId} />}
            {tab === 'banners' && <BannersTab siteId={siteId} />}
            {tab === 'categories' && <CategoriesTab siteId={siteId} />}
            {tab === 'products' && <ProductsTab siteId={siteId} />}
            {tab === 'news' && <NewsTab siteId={siteId} />}
            {tab === 'nav' && <NavTab siteId={siteId} />}
          </div>
        </div>
      )}
    </div>
  );
}