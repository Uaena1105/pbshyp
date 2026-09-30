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
    <div>
      <section className="py-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Get In <span className="text-gradient">Touch</span>
        </h1>
        <p className="mt-3 text-slate-600">
          Our team is ready to assist you. Reach us through any of the following channels.
        </p>
      </section>

      <section className="pb-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-2">

          <div className="glass-card rounded-[2rem] p-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              Contact <span className="text-gradient">Information</span>
            </h2>
            <div className="mt-7 space-y-6">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">{item.label}</div>
                    <div className="font-semibold text-foreground">{item.value}</div>
                  </div>
                </div>
              ))}
              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15">
                    <MessageCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">WhatsApp</div>
                    <div className="font-semibold text-foreground">{settings.whatsapp}</div>
                  </div>
                </a>
              )}
            </div>
          </div>


          <div className="glass-card rounded-[2rem] p-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              Send an <span className="text-gradient">Inquiry</span>
            </h2>
            <p className="mt-2 text-sm text-slate-500">
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