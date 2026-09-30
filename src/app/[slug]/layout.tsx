import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getSiteBySlug,
  getSiteSettings,
  getNavLinks,
  resolveHomeContent,
} from '@/lib/site-data';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { WhatsAppFloat } from '@/components/site/whatsapp-float';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);
  if (!site) return { title: 'Site Not Found' };
  const settings = await getSiteSettings(site.id);
  return {
    title: settings?.seo_title ?? site.name,
    description: settings?.seo_description ?? '',
    keywords: settings?.seo_keywords?.split(',').map((k) => k.trim()),
  };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);
  if (!site) notFound();

  const settings = await getSiteSettings(site.id);
  const navLinks = await getNavLinks(site.id);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      {/* 液态玻璃光晕背景 */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="aurora aurora-animate left-[-10%] top-[-10%] h-[38rem] w-[38rem] bg-sky-400/40" />
        <div
          className="aurora aurora-animate right-[-12%] top-[15%] h-[34rem] w-[34rem] bg-violet-400/30"
          style={{ animationDelay: '-6s' }}
        />
        <div
          className="aurora aurora-animate bottom-[-15%] left-[25%] h-[32rem] w-[32rem] bg-amber-300/25"
          style={{ animationDelay: '-12s' }}
        />
      </div>

      <SiteHeader
        slug={slug}
        settings={settings}
        navLinks={navLinks}
        home={resolveHomeContent(settings?.home_content)}
      />
      <main>{children}</main>
      <SiteFooter slug={slug} settings={settings} navLinks={navLinks} />
      <WhatsAppFloat whatsapp={settings?.whatsapp ?? undefined} />
    </div>
  );
}