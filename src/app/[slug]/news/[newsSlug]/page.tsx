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
    <div className="font-[Source_Sans_3,sans-serif]">
      <div className="bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <Link
            href={`/${slug}/news`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>

          {news.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={news.cover_image}
              alt={news.title}
              className="mt-6 h-64 w-full rounded-lg object-cover"
            />
          )}

          <div className="mt-6">
            <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {news.category}
            </span>
            <h1 className="mt-3 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              {news.title}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
              <CalendarDays className="h-4 w-4" />
              {new Date(news.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          {news.summary && (
            <p className="mt-6 text-lg font-medium text-slate-700">{news.summary}</p>
          )}

          {news.content && (
            <div className="mt-4 whitespace-pre-wrap leading-relaxed text-slate-600">
              {news.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}