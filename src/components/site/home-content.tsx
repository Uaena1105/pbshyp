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
} from 'lucide-react';
import type {
  SiteSettings,
  Banner,
  Category,
  Product,
  NewsItem,
} from '@/lib/site-data';

const advantages = [
  {
    icon: Leaf,
    title: 'Premium Raw Materials',
    desc: 'HDPE, LDPE, blended-material and recycled-material options are confirmed by model, application and order.',
  },
  {
    icon: Ruler,
    title: 'Custom Size & Logo',
    desc: 'Custom size, color, thickness & full-color logo printing. Flexible MOQ.',
  },
  {
    icon: ShieldCheck,
    title: 'Strict Quality Control',
    desc: 'Each batch is checked according to the agreed inspection plan and assessed against confirmed standards.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Lead time is confirmed by model, quantity, customization requirements and order.',
  },
  {
    icon: Globe2,
    title: 'Global Export Experience',
    desc: 'Exporting to 10+ countries including Japan, South Korea & Southeast Asia. Familiar with regional compliance.',
  },
  {
    icon: Headset,
    title: 'Professional Service Team',
    desc: 'Dedicated account manager, fast response, full follow-up from inquiry to delivery.',
  },
];

const process = [
  { icon: Leaf, title: 'Raw Material Sourcing', desc: 'HDPE, LDPE, blended-material or recycled-material options are selected according to the confirmed model, application and order.' },
  { icon: Factory, title: 'Film Blowing', desc: 'Film is blown to confirmed specifications with process control for thickness and width.' },
  { icon: Printer, title: 'Color Printing', desc: 'Multi-color flexographic printing follows confirmed artwork and print requirements.' },
  { icon: Ruler, title: 'Cutting & Forming', desc: 'Cutting and forming follow confirmed dimensions; tolerances are confirmed with each order.' },
  { icon: ShieldCheck, title: 'Quality Inspection', desc: 'Each batch is checked for thickness, strength, print quality and other items under the agreed inspection plan.' },
  { icon: Boxes, title: 'Counting & Packing', desc: 'Counting and packing follow confirmed quantities and packing requirements.' },
  { icon: Truck, title: 'Export Shipping', desc: 'International logistics can be coordinated; trade terms and relevant documents are confirmed by product and available records.' },
  { icon: Headset, title: 'After-sales Service', desc: 'Dedicated follow-up, issues responded within 24 hours, priority support for long-term partners.' },
];

const stats = [
  { value: '2021', label: 'Established' },
  { value: '3+', label: 'Years Experience' },
  { value: '46', label: 'SKU Models' },
  { value: '10+', label: 'Export Countries' },
  { value: '500+', label: 'Clients Served' },
  { value: '5000㎡', label: 'Factory Area' },
];

export function HomeContent({
  slug,
  settings,
  banners,
  categories,
  featuredProducts,
  news,
}: {
  slug: string;
  settings: SiteSettings | null;
  banners: Banner[];
  categories: Category[];
  featuredProducts: Product[];
  news: NewsItem[];
}) {
  const heroImage = settings?.hero_image ?? banners[0]?.image ?? '';
  const heroTitle = settings?.hero_title ?? 'Your Trusted Partner';
  const heroSubtitle = settings?.hero_subtitle ?? '';

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24 lg:py-28">
          <div className="flex flex-col items-start">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-600">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Shandong, China · Est. 2021
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {heroTitle.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-gradient">
                {heroTitle.split(' ').slice(-1)}
              </span>
            </h1>
            {heroSubtitle && (
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                {heroSubtitle}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              {['Material options', 'Confirmed per order', 'Custom OEM', 'Requirements confirmed'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="glass rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={`/${slug}/products`}
                className="sheen inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
              >
                View Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/${slug}/contact`}
                className="glass-btn inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-foreground"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {heroImage && (
            <div className="relative">
              <div className="glass-card float-slow overflow-hidden rounded-[2rem] p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage}
                  alt={heroTitle}
                  className="h-full min-h-[300px] w-full rounded-[1.6rem] object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 优势区 */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Why Choose <span className="text-gradient">Us</span>
            </h2>
            <p className="mt-3 text-slate-500">Our Advantages</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((item) => (
              <div key={item.title} className="glass-card rounded-2xl p-7">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 产品分类 */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Our <span className="text-gradient">Products</span>
              </h2>
              <p className="mt-3 text-slate-500">Product Range</p>
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
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-52 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{cat.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 精选产品 */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Featured <span className="text-gradient">Products</span>
                </h2>
              </div>
              <Link
                href={`/${slug}/products`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:brightness-110"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
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
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.main_image}
                        alt={product.name}
                        className="h-44 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {product.name}
                    </h3>
                    {product.model && <p className="mt-1 text-xs text-slate-400">{product.model}</p>}
                    {product.short_description && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                        {product.short_description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 数据统计 */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="glass-card grid grid-cols-2 gap-8 rounded-[2rem] p-10 text-center sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-gradient text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 生产流程 */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Production <span className="text-gradient">Process</span>
            </h2>
            <p className="mt-3 text-slate-500">
              From Raw Material to Finished Product — Every Step Strictly Controlled
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item, idx) => (
              <div key={item.title} className="glass-card relative rounded-2xl p-6">
                <span className="absolute right-5 top-5 text-3xl font-extrabold tracking-tight text-slate-200">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <item.icon className="h-7 w-7 text-primary" />
                <h3 className="mt-4 font-bold tracking-tight text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 关于预览 */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Established Manufacturer, <span className="text-gradient">Global Reach</span>
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              {settings?.company_name ?? 'Our company'} focuses on the development, production and
              export of quality products. Material options, dimensions, thickness, color and
              printing are confirmed by model, application and order.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-4">
              {['Premium materials', 'Custom OEM', 'Quality control', 'Fast delivery'].map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  {f}
                </div>
              ))}
            </div>
            <Link
              href={`/${slug}/about`}
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
            >
              Learn More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {banners.slice(0, 2).map((b, i) => (
              <div
                key={b.id}
                className={`glass-card overflow-hidden rounded-3xl p-2 ${i === 0 ? 'mt-8' : ''}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.image}
                  alt={b.title ?? ''}
                  className="h-full w-full rounded-2xl object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 新闻预览 */}
      {news.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  News & <span className="text-gradient">Updates</span>
                </h2>
                <p className="mt-3 text-slate-500">
                  Industry Trends · Company News · Product Updates
                </p>
              </div>
              <Link
                href={`/${slug}/news`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:brightness-110"
              >
                Read More
                <ArrowRight className="h-4 w-4" />
              </Link>
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
                  <h3 className="mt-4 font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  {item.summary && (
                    <p className="mt-2.5 line-clamp-3 text-sm text-slate-600">{item.summary}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="glass-card relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center">
            <div className="aurora left-[-10%] top-[-30%] h-72 w-72 bg-sky-400/40" />
            <div className="aurora right-[-10%] bottom-[-30%] h-72 w-72 bg-violet-400/40" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Ready to <span className="text-gradient">Work Together?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-600">
                Tell us your needs and we&apos;ll reply within 24 hours with a professional quote
                and sample support.
              </p>
              <Link
                href={`/${slug}/contact`}
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
              >
                Get In Touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}