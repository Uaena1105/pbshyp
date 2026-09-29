import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiteBySlug, getSiteSettings, getNavLinks } from '@/lib/site-data';
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
    <div className="min-h-screen bg-white">
      <SiteHeader slug={slug} settings={settings} navLinks={navLinks} />
      <main>{children}</main>
      <SiteFooter slug={slug} settings={settings} navLinks={navLinks} />
      <WhatsAppFloat whatsapp={settings?.whatsapp ?? undefined} />
    </div>
  );
}