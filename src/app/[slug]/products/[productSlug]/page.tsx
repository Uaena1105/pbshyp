import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessageCircle, ClipboardList } from 'lucide-react';
import { getSiteBySlug, getSiteSettings, getProductBySlug } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug, productSlug } = await params;
  const site = await getSiteBySlug(slug);
  if (!site) notFound();

  const [settings, product] = await Promise.all([
    getSiteSettings(site.id),
    getProductBySlug(site.id, productSlug),
  ]);
  if (!product) notFound();

  const images = product.images?.length
    ? product.images
    : product.main_image
      ? [product.main_image]
      : [];
  const specs: { name: string; value: string }[] = Array.isArray(product.specifications)
    ? product.specifications
    : [];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <Link
          href={`/${slug}/products`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          {/* 图片区 */}
          <div>
            <div className="glass-card overflow-hidden rounded-[2rem] p-2">
              {product.main_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.main_image}
                  alt={product.name}
                  className="h-[28rem] w-full rounded-[1.6rem] object-cover"
                />
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="glass overflow-hidden rounded-xl p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="h-20 w-full rounded-lg object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 信息区 */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {product.name}
            </h1>
            {product.model && <p className="mt-2 text-sm text-slate-500">Model: {product.model}</p>}
            {product.price && (
              <p className="mt-3 text-2xl font-extrabold tracking-tight text-primary">
                From ${product.price} / unit
              </p>
            )}
            {product.short_description && (
              <p className="mt-4 leading-relaxed text-slate-600">{product.short_description}</p>
            )}

            {specs.length > 0 && (
              <div className="mt-7">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  Product Specifications
                </h2>
                <div className="glass mt-4 overflow-hidden rounded-2xl">
                  {specs.map((s, i) => (
                    <div
                      key={i}
                      className={`flex justify-between px-5 py-3.5 text-sm ${
                        i % 2 === 0 ? 'bg-white/30' : ''
                      }`}
                    >
                      <span className="font-medium text-slate-600">{s.name}</span>
                      <span className="font-semibold text-foreground">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${slug}/contact`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
              >
                <ClipboardList className="h-4 w-4" />
                Send Inquiry
              </Link>
              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-400"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Now
                </a>
              )}
            </div>
          </div>
        </div>

        {product.description && (
          <div className="mt-12">
            <div className="glass-card rounded-[2rem] p-8">
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">Description</h2>
              <p className="mt-4 leading-relaxed text-slate-600">{product.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}