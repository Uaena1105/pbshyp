import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Globe, ArrowUpRight, LayoutDashboard } from 'lucide-react';
import { getAllSites } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const sites = await getAllSites();

  if (sites.length === 1) {
    redirect(`/${sites[0].slug}`);
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="aurora aurora-animate left-[-10%] top-[-10%] h-[36rem] w-[36rem] bg-sky-400/40" />
        <div
          className="aurora aurora-animate right-[-10%] top-[20%] h-[32rem] w-[32rem] bg-violet-400/30"
          style={{ animationDelay: '-6s' }}
        />
        <div
          className="aurora aurora-animate bottom-[-15%] left-[30%] h-[30rem] w-[30rem] bg-amber-300/25"
          style={{ animationDelay: '-12s' }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <div className="glass-card mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Multi-Site <span className="text-gradient">CMS</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Your websites are ready. Select one below to visit.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Link
              key={site.id}
              href={`/${site.slug}`}
              className="glass-card group flex items-center justify-between rounded-2xl p-6"
            >
              <div className="min-w-0">
                <div className="text-sm text-slate-400">/{site.slug}</div>
                <div className="mt-1.5 truncate text-lg font-bold tracking-tight text-foreground">
                  {site.name}
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/admin"
            className="glass-btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />
            Manage Sites
          </Link>
        </div>
      </div>
    </main>
  );
}