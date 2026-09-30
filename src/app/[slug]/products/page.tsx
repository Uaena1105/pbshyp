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
  const { data: products } = await getProducts(site.id, activeCategory?.id, 1, 100);

  const heroImage = settings?.hero_image ?? banners[0]?.image ?? '';

  return (
    <div>

      <section className="relative py-16 text-center">
        {heroImage && (

          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          />
        )}
        <div className="relative">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Product <span className="text-gradient">Center</span>
          </h1>
          <p className="mt-3 text-slate-600">Full-range Packaging Solutions</p>
        </div>
      </section>


      <div className="mx-auto max-w-7xl px-6">
        <div className="glass flex flex-wrap gap-2 rounded-2xl p-2">
          <Link
            href={`/${slug}/products`}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              !activeCategory
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${slug}/products?category=${cat.slug}`}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                activeCategory?.id === cat.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>


      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          {products.length === 0 ? (
            <div className="glass-card rounded-2xl py-20 text-center text-slate-500">
              No products found.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/${slug}/products/${product.slug}`}
                  className="glass-card group overflow-hidden rounded-2xl"
                >
                  <div className="overflow-hidden">
                    {product.main_image && (

                      <img
                        src={product.main_image}
                        alt={product.name}
                        className="h-56 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {product.name}
                    </h3>
                    {product.model && <p className="mt-1 text-xs text-slate-400">{product.model}</p>}
                    {product.short_description && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                        {product.short_description}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      View Details
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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