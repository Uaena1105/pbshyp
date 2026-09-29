import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { getSiteBySlug, getNewsBySlug } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string; newsSlug: string }>;
}) {
  const { slug, newsSlug } = await params;
  const site = await getSiteBySlug(slug);
  if (!site) notFound();

  const news = await getNewsBySlug(site.id, newsSlug);
  if (!news) notFound();

  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href={`/${slug}/news`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to News
        </Link>

        <div className="glass-card mt-8 overflow-hidden rounded-[2rem] p-8 md:p-10">
          {news.cover_image && (
            <div className="-mx-8 -mt-8 mb-8 overflow-hidden md:-mx-10 md:-mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={news.cover_image}
                alt={news.title}
                className="h-72 w-full object-cover"
              />
            </div>
          )}

          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {news.category}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {news.title}
          </h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
            <CalendarDays className="h-4 w-4" />
            {new Date(news.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>

          {news.summary && (
            <p className="mt-6 text-lg font-medium leading-relaxed text-slate-700">
              {news.summary}
            </p>
          )}

          {news.content && (
            <div className="mt-5 whitespace-pre-wrap leading-relaxed text-slate-600">
              {news.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}