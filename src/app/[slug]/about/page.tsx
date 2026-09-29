import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { getSiteBySlug, getSiteSettings, getPageBySlug, getBanners } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);
  if (!site) return { title: 'About' };
  return { title: `About Us | ${site.name}` };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);
  if (!site) notFound();

  const [settings, page, banners] = await Promise.all([
    getSiteSettings(site.id),
    getPageBySlug(site.id, 'about'),
    getBanners(site.id),
  ]);

  const content = page?.content as
    | { title?: string; paragraphs?: string[]; facts?: { label: string; value: string }[] }
    | undefined;

  const title = content?.title ?? 'About Our Company';
  const paragraphs = content?.paragraphs ?? [
    `${settings?.company_name ?? 'Our company'} is a leading manufacturer with years of industry experience.`,
    'We are committed to innovation, quality, and customer satisfaction.',
  ];
  const facts = content?.facts ?? [];
  const bannerImage = page?.banner_image ?? banners[0]?.image ?? '';

  return (
    <div className="font-[Source_Sans_3,sans-serif]">
      {bannerImage && (
        <div className="relative h-60 md:h-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bannerImage} alt={title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">{title}</h1>
          </div>
        </div>
      )}

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">Our Story</h2>
          <div className="mt-6 space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed text-slate-600">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {facts.length > 0 && (
        <section className="bg-blue-900 py-14">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 text-center sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label}>
                <div className="font-serif text-3xl font-bold text-white">{f.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-blue-200">{f.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-serif text-2xl font-bold text-slate-900">Our Journey</h2>
          <ul className="mt-6 space-y-4">
            {[
              'Expanded production capacity to 5,000㎡',
              'Began exporting to Japan and South Korea',
              'Expanded to Southeast Asian markets',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}