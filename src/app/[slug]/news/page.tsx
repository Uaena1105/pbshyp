import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { getSiteBySlug, getNews } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

const categoryColors: Record<string, string> = {
  industry: 'bg-sky-500/15 text-sky-600',
  company: 'bg-emerald-500/15 text-emerald-600',
  product: 'bg-amber-500/15 text-amber-600',
  certification: 'bg-violet-500/15 text-violet-600',
  events: 'bg-rose-500/15 text-rose-600',
};

export default async function NewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);
  if (!site) notFound();

  const news = await getNews(site.id, 50);

  return (
    <div>
      <section className="py-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          News & <span className="text-gradient">Updates</span>
        </h1>
        <p className="mt-3 text-slate-600">Industry Trends · Company News · Product Updates</p>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-5xl px-6">
          {news.length === 0 ? (
            <div className="glass-card rounded-2xl py-20 text-center text-slate-500">
              No news yet.
            </div>
          ) : (
            <div className="space-y-6">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={`/${slug}/news/${item.slug}`}
                  className="glass-card group flex flex-col gap-6 rounded-2xl p-5 sm:flex-row"
                >
                  {item.cover_image && (
                    <div className="overflow-hidden rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.cover_image}
                        alt={item.title}
                        className="h-44 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 sm:h-32 sm:w-52"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          categoryColors[item.category] ?? categoryColors.industry
                        }`}
                      >
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(item.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h2 className="mt-3 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </h2>
                    {item.summary && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.summary}</p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Read More
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