import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import {
  getSiteBySlug,
  getSiteSettings,
  getCategories,
  getProducts,
  getBanners,
} from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { slug } = await params;
  const { category } = await searchParams;
  const site = await getSiteBySlug(slug);
  if (!site) notFound();

  const [settings, categories, banners] = await Promise.all([
    getSiteSettings(site.id),
    getCategories(site.id),
    getBanners(site.id),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);
  const { data: products } = await getProducts(
    site.id,
    activeCategory?.id,
    1,
    100,
  );

  const heroImage = settings?.hero_image ?? banners[0]?.image ?? '';

  return (
    <div className="font-[Source_Sans_3,sans-serif]">
      {/* 页头 */}
      <section className="relative bg-slate-900 py-16 text-center">
        {heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        )}
        <div className="relative">
          <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            Product Center
          </h1>
          <p className="mt-3 text-slate-300">Full-range Packaging Solutions</p>
        </div>
      </section>

      {/* 分类过滤 */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-4">
          <Link
            href={`/${slug}/products`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !activeCategory
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${slug}/products?category=${cat.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory?.id === cat.id
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 产品网格 */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          {products.length === 0 ? (
            <div className="py-20 text-center text-slate-500">No products found.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/${slug}/products/${product.slug}`}
                  className="group overflow-hidden rounded-lg border border-slate-100 bg-white transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  {product.main_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.main_image}
                      alt={product.name}
                      className="h-52 w-full object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-blue-700">
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
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-700">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}