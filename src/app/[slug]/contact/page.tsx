import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { getSiteBySlug, getSiteSettings } from '@/lib/site-data';
import { ContactForm } from '@/components/site/contact-form';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);
  if (!site) return { title: 'Contact' };
  return { title: `Contact Us | ${site.name}` };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);
  if (!site) notFound();

  const settings = await getSiteSettings(site.id);

  const contactItems = [
    { icon: MapPin, label: 'Address', value: settings?.address ?? '' },
    { icon: Phone, label: 'Phone', value: settings?.phone ?? '' },
    { icon: Mail, label: 'Email', value: settings?.email ?? '' },
  ].filter((c) => c.value);

  return (
    <div className="font-[Source_Sans_3,sans-serif]">
      <section className="bg-slate-900 py-16 text-center">
        <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">Get In Touch</h1>
        <p className="mt-3 text-slate-300">
          Our team is ready to assist you. Reach us through any of the following channels.
        </p>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
          {/* 联系信息 */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">Contact Information</h2>
            <div className="mt-6 space-y-5">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-900 text-white">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">{item.label}</div>
                    <div className="font-medium text-slate-900">{item.value}</div>
                  </div>
                </div>
              ))}
              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-green-600 text-white">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">WhatsApp</div>
                    <div className="font-medium text-slate-900">{settings.whatsapp}</div>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* 表单 */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-slate-900">Send an Inquiry</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tell us your needs and we&apos;ll reply within 24 hours.
            </p>
            <div className="mt-6">
              <ContactForm whatsapp={settings?.whatsapp ?? undefined} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}