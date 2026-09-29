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

  const images = product.images?.length ? product.images : product.main_image ? [product.main_image] : [];
  const specs: { name: string; value: string }[] = Array.isArray(product.specifications)
    ? product.specifications
    : [];

  return (
    <div className="font-[Source_Sans_3,sans-serif]">
      <div className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <Link
            href={`/${slug}/products`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-2">
            {/* 图片区 */}
            <div>
              <div className="overflow-hidden rounded-lg bg-white">
                {product.main_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.main_image}
                    alt={product.name}
                    className="h-96 w-full object-cover"
                  />
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="h-20 w-full rounded-md object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 信息区 */}
            <div>
              <h1 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                {product.name}
              </h1>
              {product.model && (
                <p className="mt-2 text-sm text-slate-500">Model: {product.model}</p>
              )}
              {product.price && (
                <p className="mt-2 text-lg font-semibold text-blue-900">
                  From ${product.price} / unit
                </p>
              )}
              {product.short_description && (
                <p className="mt-4 text-slate-600">{product.short_description}</p>
              )}

              {specs.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-serif text-lg font-bold text-slate-900">
                    Product Specifications
                  </h2>
                  <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                    {specs.map((s, i) => (
                      <div
                        key={i}
                        className={`flex justify-between px-4 py-3 text-sm ${
                          i % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                        }`}
                      >
                        <span className="font-medium text-slate-600">{s.name}</span>
                        <span className="text-slate-900">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/${slug}/contact`}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                >
                  <ClipboardList className="h-4 w-4" />
                  Send Inquiry
                </Link>
                {settings?.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-500"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Now
                  </a>
                )}
              </div>
            </div>
          </div>

          {product.description && (
            <div className="mt-10">
              <h2 className="font-serif text-lg font-bold text-slate-900">Description</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}