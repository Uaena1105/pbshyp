import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { getSiteBySlug, getNews } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

const categoryColors: Record<string, string> = {
  industry: 'bg-blue-50 text-blue-700',
  company: 'bg-green-50 text-green-700',
  product: 'bg-amber-50 text-amber-700',
  certification: 'bg-purple-50 text-purple-700',
  events: 'bg-rose-50 text-rose-700',
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
    <div className="font-[Source_Sans_3,sans-serif]">
      <section className="bg-slate-900 py-16 text-center">
        <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">News & Updates</h1>
        <p className="mt-3 text-slate-300">Industry Trends · Company News · Product Updates</p>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-5xl px-4">
          {news.length === 0 ? (
            <div className="py-20 text-center text-slate-500">No news yet.</div>
          ) : (
            <div className="space-y-6">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={`/${slug}/news/${item.slug}`}
                  className="group flex flex-col gap-4 rounded-lg border border-slate-100 bg-white p-5 transition-all hover:shadow-md sm:flex-row"
                >
                  {item.cover_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      className="h-40 w-full rounded-md object-cover sm:h-28 sm:w-44"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
                    <h2 className="mt-2 font-serif text-lg font-bold text-slate-900 group-hover:text-blue-700">
                      {item.title}
                    </h2>
                    {item.summary && (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.summary}</p>
                    )}
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-700">
                      Read More
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