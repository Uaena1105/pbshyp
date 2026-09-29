import { notFound } from 'next/navigation';
import {
  getSiteBySlug,
  getSiteSettings,
  getBanners,
  getCategories,
  getFeaturedProducts,
  getNews,
} from '@/lib/site-data';
import { HomeContent } from '@/components/site/home-content';

export const dynamic = 'force-dynamic';

export default async function SiteHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);
  if (!site) notFound();

  const [settings, banners, categories, featuredProducts, news] = await Promise.all([
    getSiteSettings(site.id),
    getBanners(site.id),
    getCategories(site.id),
    getFeaturedProducts(site.id),
    getNews(site.id, 6),
  ]);

  return (
    <HomeContent
      slug={slug}
      settings={settings}
      banners={banners}
      categories={categories}
      featuredProducts={featuredProducts}
      news={news}
    />
  );
}