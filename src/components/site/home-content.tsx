'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Factory,
  Leaf,
  Printer,
  Ruler,
  ShieldCheck,
  Truck,
  Globe2,
  Headset,
  Boxes,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type {
  SiteSettings,
  Banner,
  Category,
  Product,
  NewsItem,
  HomeContent as HomeContentType,
} from '@/lib/site-data';
import { EditableText, EditableImage } from './editor';

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Ruler,
  ShieldCheck,
  Truck,
  Globe2,
  Headset,
  Factory,
  Printer,
  Boxes,
  Sparkles,
};

function Icon({ name }: { name: string }) {
  const Cmp = iconMap[name] ?? CheckCircle2;
  return <Cmp className="h-6 w-6 text-primary" />;
}

export function HomeContent({
  slug,
  settings,
  banners,
  categories,
  featuredProducts,
  news,
  home,
}: {
  slug: string;
  settings: SiteSettings | null;
  banners: Banner[];
  categories: Category[];
  featuredProducts: Product[];
  news: NewsItem[];
  home: HomeContentType;
}) {
  const heroImage = settings?.hero_image ?? banners[0]?.image ?? '';
  const heroTitle = settings?.hero_title ?? 'Your Trusted Partner';
  const heroSubtitle = settings?.hero_subtitle ?? '';
  const heroButtonText = settings?.hero_button_text ?? 'View Products';

  const titleParts = heroTitle.split(' ');

  return (
    <div>

      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24 lg:py-28">
          <div className="flex flex-col items-start">
            <EditableText
              field="home.heroTag"
              label="顶部标签"
              value={home.heroTag}
              wrapperClassName="inline-flex"
            >
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-600">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {home.heroTag}
              </span>
            </EditableText>

            <EditableText field="settings.heroTitle" label="主标题" value={heroTitle}>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {titleParts.length > 1 ? (
                  <>
                    {titleParts.slice(0, -1).join(' ')}{' '}
                    <span className="text-gradient">{titleParts.slice(-1)}</span>
                  </>
                ) : (
                  <span className="text-gradient">{heroTitle}</span>
                )}
              </h1>
            </EditableText>

            <EditableText
              field="settings.heroSubtitle"
              label="副标题"
              value={heroSubtitle}
              kind="textarea"
            >
              {heroSubtitle && (
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                  {heroSubtitle}
                </p>
              )}
            </EditableText>

            <div className="mt-6 flex flex-wrap gap-2">
              {home.heroTags.map((tag, i) => (
                <EditableText
                  key={i}
                  field={`home.heroTags.${i}`}
                  label={`标签 ${i + 1}`}
                  value={tag}
                  wrapperClassName="inline-flex"
                >
                  <span className="glass rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-600">
                    {tag}
                  </span>
                </EditableText>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <EditableText
                field="settings.heroButtonText"
                label="主按钮文字"
                value={heroButtonText}
                wrapperClassName="inline-flex"
              >
                <Link
                  href={`/${slug}/products`}
                  className="sheen inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
                >
                  {heroButtonText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </EditableText>
              <EditableText
                field="home.heroSecondaryButton"
                label="副按钮文字"
                value={home.heroSecondaryButton}
                wrapperClassName="inline-flex"
              >
                <Link
                  href={`/${slug}/contact`}
                  className="glass-btn inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-foreground"
                >
                  {home.heroSecondaryButton}
                </Link>
              </EditableText>
            </div>
          </div>

          {heroImage && (
            <div className="relative">
              <div className="glass-card float-slow overflow-hidden rounded-[2rem] p-2">
                <EditableImage
                  field="settings.heroImage"
                  label="首页主图"
                  value={heroImage}
                  alt={heroTitle}
                  imgClassName="h-full min-h-[300px] w-full rounded-[1.6rem] object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </section>


      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <EditableText field="home.whyTitle" label="优势区标题" value={home.whyTitle}>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {home.whyTitle}
              </h2>
            </EditableText>
            <EditableText
              field="home.whySubtitle"
              label="优势区副标题"
              value={home.whySubtitle}
              wrapperClassName="inline-flex"
            >
              <p className="mt-3 text-slate-500">{home.whySubtitle}</p>
            </EditableText>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {home.advantages.map((item, i) => (
              <div key={i} className="glass-card rounded-2xl p-7">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon name={item.icon} />
                </div>
                <EditableText
                  field={`home.advantages.${i}.title`}
                  label={`优势 ${i + 1} 标题`}
                  value={item.title}
                >
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                </EditableText>
                <EditableText
                  field={`home.advantages.${i}.desc`}
                  label={`优势 ${i + 1} 描述`}
                  value={item.desc}
                  kind="textarea"
                >
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </EditableText>
              </div>
            ))}
          </div>
        </div>
      </section>


      {categories.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <EditableText
                field="home.categoriesTitle"
                label="分类区标题"
                value={home.categoriesTitle}
              >
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {home.categoriesTitle}
                </h2>
              </EditableText>
              <EditableText
                field="home.categoriesSubtitle"
                label="分类区副标题"
                value={home.categoriesSubtitle}
                wrapperClassName="inline-flex"
              >
                <p className="mt-3 text-slate-500">{home.categoriesSubtitle}</p>
              </EditableText>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${slug}/products?category=${cat.slug}`}
                  className="glass-card group overflow-hidden rounded-2xl"
                >
                  <div className="overflow-hidden">
                    {cat.image && (
                      <EditableImage
                        field={`category.${cat.id}.image`}
                        label="分类图片"
                        value={cat.image}
                        alt={cat.name}
                        imgClassName="h-52 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <EditableText
                      field={`category.${cat.id}.name`}
                      label="分类名称"
                      value={cat.name}
                    >
                      <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {cat.name}
                      </h3>
                    </EditableText>
                    {cat.description && (
                      <EditableText
                        field={`category.${cat.id}.description`}
                        label="分类描述"
                        value={cat.description}
                        kind="textarea"
                      >
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                          {cat.description}
                        </p>
                      </EditableText>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}


      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between">
              <EditableText
                field="home.featuredTitle"
                label="精选产品标题"
                value={home.featuredTitle}
              >
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {home.featuredTitle}
                </h2>
              </EditableText>
              <EditableText
                field="home.viewAllText"
                label="查看全部按钮"
                value={home.viewAllText}
                wrapperClassName="inline-flex"
              >
                <Link
                  href={`/${slug}/products`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:brightness-110"
                >
                  {home.viewAllText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </EditableText>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/${slug}/products/${product.slug}`}
                  className="glass-card group rounded-2xl p-3"
                >
                  <div className="overflow-hidden rounded-xl">
                    {product.main_image && (
                      <EditableImage
                        field={`product.${product.id}.mainImage`}
                        label="产品主图"
                        value={product.main_image}
                        alt={product.name}
                        imgClassName="h-44 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <EditableText
                      field={`product.${product.id}.name`}
                      label="产品名称"
                      value={product.name}
                    >
                      <h3 className="font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {product.name}
                      </h3>
                    </EditableText>
                    {product.model && <p className="mt-1 text-xs text-slate-400">{product.model}</p>}
                    {product.short_description && (
                      <EditableText
                        field={`product.${product.id}.shortDescription`}
                        label="产品简介"
                        value={product.short_description}
                        kind="textarea"
                      >
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                          {product.short_description}
                        </p>
                      </EditableText>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}


      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="glass-card grid grid-cols-2 gap-8 rounded-[2rem] p-10 text-center sm:grid-cols-3 lg:grid-cols-6">
            {home.stats.map((s, i) => (
              <div key={i}>
                <EditableText
                  field={`home.stats.${i}.value`}
                  label={`数据 ${i + 1} 数值`}
                  value={s.value}
                >
                  <div className="text-gradient text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {s.value}
                  </div>
                </EditableText>
                <EditableText
                  field={`home.stats.${i}.label`}
                  label={`数据 ${i + 1} 标签`}
                  value={s.label}
                >
                  <div className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                    {s.label}
                  </div>
                </EditableText>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <EditableText
              field="home.processTitle"
              label="流程区标题"
              value={home.processTitle}
            >
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {home.processTitle}
              </h2>
            </EditableText>
            <EditableText
              field="home.processSubtitle"
              label="流程区副标题"
              value={home.processSubtitle}
              kind="textarea"
              wrapperClassName="inline-flex"
            >
              <p className="mt-3 text-slate-500">{home.processSubtitle}</p>
            </EditableText>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {home.process.map((item, idx) => (
              <div key={idx} className="glass-card relative rounded-2xl p-6">
                <span className="absolute right-5 top-5 text-3xl font-extrabold tracking-tight text-slate-200">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <Icon name={item.icon} />
                <EditableText
                  field={`home.process.${idx}.title`}
                  label={`步骤 ${idx + 1} 标题`}
                  value={item.title}
                >
                  <h3 className="mt-4 font-bold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                </EditableText>
                <EditableText
                  field={`home.process.${idx}.desc`}
                  label={`步骤 ${idx + 1} 描述`}
                  value={item.desc}
                  kind="textarea"
                >
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </EditableText>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <EditableText
              field="home.aboutTitle"
              label="关于区标题"
              value={home.aboutTitle}
            >
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {home.aboutTitle}
              </h2>
            </EditableText>
            <EditableText
              field="home.aboutDesc"
              label="关于区描述"
              value={home.aboutDesc}
              kind="textarea"
            >
              <p className="mt-5 leading-relaxed text-slate-600">{home.aboutDesc}</p>
            </EditableText>
            <div className="mt-7 grid grid-cols-2 gap-4">
              {home.aboutFeatures.map((f, i) => (
                <EditableText
                  key={i}
                  field={`home.aboutFeatures.${i}`}
                  label={`特点 ${i + 1}`}
                  value={f}
                >
                  <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    {f}
                  </div>
                </EditableText>
              ))}
            </div>
            <EditableText
              field="home.learnMoreText"
              label="了解更多按钮"
              value={home.learnMoreText}
              wrapperClassName="mt-9 inline-flex"
            >
              <Link
                href={`/${slug}/about`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
              >
                {home.learnMoreText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </EditableText>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {banners.slice(0, 2).map((b, i) => (
              <div
                key={b.id}
                className={`glass-card overflow-hidden rounded-3xl p-2 ${i === 0 ? 'mt-8' : ''}`}
              >
                <EditableImage
                  field={`banner.${b.id}.image`}
                  label="展示图片"
                  value={b.image}
                  alt={b.title ?? ''}
                  imgClassName="h-full w-full rounded-2xl object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>


      {news.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between">
              <div>
                <EditableText
                  field="home.newsTitle"
                  label="新闻区标题"
                  value={home.newsTitle}
                >
                  <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    {home.newsTitle}
                  </h2>
                </EditableText>
                <EditableText
                  field="home.newsSubtitle"
                  label="新闻区副标题"
                  value={home.newsSubtitle}
                  wrapperClassName="inline-flex"
                >
                  <p className="mt-3 text-slate-500">{home.newsSubtitle}</p>
                </EditableText>
              </div>
              <EditableText
                field="home.readMoreText"
                label="阅读更多按钮"
                value={home.readMoreText}
                wrapperClassName="inline-flex"
              >
                <Link
                  href={`/${slug}/news`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:brightness-110"
                >
                  {home.readMoreText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </EditableText>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {news.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`/${slug}/news/${item.slug}`}
                  className="glass-card group rounded-2xl p-6"
                >
                  <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {item.category}
                  </span>
                  <EditableText
                    field={`news.${item.id}.title`}
                    label="新闻标题"
                    value={item.title}
                  >
                    <h3 className="mt-4 font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>
                  </EditableText>
                  {item.summary && (
                    <EditableText
                      field={`news.${item.id}.summary`}
                      label="新闻摘要"
                      value={item.summary}
                      kind="textarea"
                    >
                      <p className="mt-2.5 line-clamp-3 text-sm text-slate-600">{item.summary}</p>
                    </EditableText>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}


      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="glass-card relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center">
            <div className="aurora left-[-10%] top-[-30%] h-72 w-72 bg-sky-400/40" />
            <div className="aurora right-[-10%] bottom-[-30%] h-72 w-72 bg-violet-400/40" />
            <div className="relative">
              <EditableText field="home.ctaTitle" label="CTA 标题" value={home.ctaTitle}>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {home.ctaTitle}
                </h2>
              </EditableText>
              <EditableText
                field="home.ctaDesc"
                label="CTA 描述"
                value={home.ctaDesc}
                kind="textarea"
                wrapperClassName="inline-flex"
              >
                <p className="mx-auto mt-4 max-w-xl text-slate-600">{home.ctaDesc}</p>
              </EditableText>
              <EditableText
                field="home.ctaButtonText"
                label="CTA 按钮文字"
                value={home.ctaButtonText}
                wrapperClassName="inline-flex"
              >
                <Link
                  href={`/${slug}/contact`}
                  className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
                >
                  {home.ctaButtonText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </EditableText>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}