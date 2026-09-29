import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Globe, ArrowUpRight } from 'lucide-react';
import { getAllSites } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const sites = await getAllSites();

  if (sites.length === 1) {
    redirect(`/${sites[0].slug}`);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-20">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Globe className="h-7 w-7" />
          </div>
          <h1 className="mt-6 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Multi-Site CMS
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            Your websites are ready. Select one below to visit.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Link
              key={site.id}
              href={`/${site.slug}`}
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-900 hover:shadow-md"
            >
              <div className="min-w-0">
                <div className="text-sm text-slate-400">/{site.slug}</div>
                <div className="mt-1 truncate font-serif text-lg font-semibold text-slate-900">
                  {site.name}
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-900" />
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Manage Sites
          </Link>
        </div>
      </div>
    </main>
  );
}