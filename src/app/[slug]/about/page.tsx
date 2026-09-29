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
    <div>
      <section className="relative py-20 text-center">
        {bannerImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bannerImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover opacity-15 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          />
        )}
        <div className="relative">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {title.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-gradient">{title.split(' ').slice(-1)}</span>
          </h1>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Our <span className="text-gradient">Story</span>
            </h2>
            <div className="mt-6 space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {facts.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-5xl px-6">
            <div className="glass-card grid grid-cols-2 gap-8 rounded-[2rem] p-10 text-center sm:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <div className="text-gradient text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {f.value}
                  </div>
                  <div className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                    {f.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              Our <span className="text-gradient">Journey</span>
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                'Expanded production capacity to 5,000㎡',
                'Began exporting to Japan and South Korea',
                'Expanded to Southeast Asian markets',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 font-medium text-slate-700">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}