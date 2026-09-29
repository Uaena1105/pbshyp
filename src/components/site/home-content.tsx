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
    <div className="font-[Source_Sans_3,sans-serif]">
      {/* Hero */}
      <section className="relative bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24 lg:py-28">
          <div className="flex flex-col justify-center">
            <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              Shandong, China · Est. 2021
            </p>
            <h1 className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
                {heroSubtitle}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              {['Material options', 'Confirmed per order', 'Custom OEM', 'Requirements confirmed per product'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-slate-600 bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-300"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${slug}/products`}
                className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
              >
                View Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/${slug}/contact`}
                className="inline-flex items-center gap-2 rounded-md border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-400 hover:text-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
          {heroImage && (
            <div className="relative overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt={heroTitle}
                className="h-full min-h-[280px] w-full object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* 优势区 */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              Why Choose Us
            </h2>
            <p className="mt-2 text-slate-500">Our Advantages</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-slate-100 p-6 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <item.icon className="h-8 w-8 text-blue-700" />
                <h3 className="mt-4 font-serif text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 产品分类 */}
      {categories.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                Our Products
              </h2>
              <p className="mt-2 text-slate-500">Product Range</p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${slug}/products?category=${cat.slug}`}
                  className="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
                >
                  {cat.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-blue-700">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">{cat.description}</p>
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
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                  Featured Products
                </h2>
              </div>
              <Link
                href={`/${slug}/products`}
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-600"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/${slug}/products/${product.slug}`}
                  className="group rounded-lg border border-slate-100 bg-white p-3 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  {product.main_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.main_image}
                      alt={product.name}
                      className="h-44 w-full rounded-md object-cover"
                    />
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">
                      {product.name}
                    </h3>
                    {product.model && (
                      <p className="mt-1 text-xs text-slate-400">{product.model}</p>
                    )}
                    {product.short_description && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
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
      <section className="bg-blue-900 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:grid-cols-3 lg:grid-cols-6">
          {[
            { value: '2021', label: 'Established' },
            { value: '3+', label: 'Years Experience' },
            { value: '46', label: 'SKU Models' },
            { value: '10+', label: 'Export Countries' },
            { value: '500+', label: 'Clients Served' },
            { value: '5000㎡', label: 'Factory Area' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-serif text-3xl font-bold text-white">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-blue-200">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 生产流程 */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              Production Process
            </h2>
            <p className="mt-2 text-slate-500">
              From Raw Material to Finished Product — Every Step Strictly Controlled
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item, idx) => (
              <div key={item.title} className="relative rounded-lg border border-slate-100 p-6">
                <span className="absolute right-4 top-4 font-serif text-3xl font-bold text-slate-100">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <item.icon className="h-7 w-7 text-blue-700" />
                <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 关于预览 */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              Established Manufacturer, Global Reach
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              {settings?.company_name ?? 'Our company'} focuses on the development, production and
              export of quality products. Material options, dimensions, thickness, color and
              printing are confirmed by model, application and order.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {['Premium materials', 'Custom OEM', 'Quality control', 'Fast delivery'].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  {f}
                </div>
              ))}
            </div>
            <Link
              href={`/${slug}/about`}
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
            >
              Learn More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {banners.slice(0, 2).map((b, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={b.id}
                src={b.image}
                alt={b.title ?? ''}
                className={`h-full w-full rounded-lg object-cover ${i === 0 ? 'mt-8' : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 新闻预览 */}
      {news.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                  News & Updates
                </h2>
                <p className="mt-2 text-slate-500">Industry Trends · Company News · Product Updates</p>
              </div>
              <Link
                href={`/${slug}/news`}
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-600"
              >
                Read More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {news.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`/${slug}/news/${item.slug}`}
                  className="group rounded-lg border border-slate-100 p-5 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {item.category}
                  </span>
                  <h3 className="mt-3 font-semibold text-slate-900 group-hover:text-blue-700">
                    {item.title}
                  </h3>
                  {item.summary && (
                    <p className="mt-2 line-clamp-3 text-sm text-slate-500">{item.summary}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-blue-900 py-16 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
            Ready to Work Together?
          </h2>
          <p className="mt-4 text-blue-100">
            Tell us your needs and we&apos;ll reply within 24 hours with a professional quote and
            sample support.
          </p>
          <Link
            href={`/${slug}/contact`}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-8 py-3 text-sm font-semibold text-blue-900 transition-colors hover:bg-blue-50"
          >
            Get In Touch
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}