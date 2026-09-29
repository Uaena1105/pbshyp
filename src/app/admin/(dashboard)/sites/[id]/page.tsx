import { notFound } from 'next/navigation';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { SiteEditor } from '@/components/admin/site-editor';

export const dynamic = 'force-dynamic';

export default async function SiteEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = getSupabaseClient();
  const { data: site, error } = await client
    .from('sites')
    .select('*')
    .eq('id', Number(id))
    .maybeSingle();

  if (error || !site) notFound();

  return <SiteEditor siteId={site.id} siteName={site.name} slug={site.slug} />;
}