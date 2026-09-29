import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import type { SiteSettings, NavLink } from '@/lib/site-data';

export function SiteFooter({
  slug,
  settings,
  navLinks,
}: {
  slug: string;
  settings: SiteSettings | null;
  navLinks: NavLink[];
}) {
  const companyName = settings?.company_name ?? 'Company Name';
  const address = settings?.address ?? '';
  const phone = settings?.phone ?? '';
  const email = settings?.email ?? '';
  const whatsapp = settings?.whatsapp ?? '';

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">{companyName}</h3>
            <p className="mt-4 text-sm leading-relaxed">
              {settings?.seo_description ??
                'Quality solutions exported worldwide. Trusted by international buyers.'}
            </p>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-500"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {navLinks.map((link) => {
                const href = link.href ? `/${slug}/${link.href}` : `/${slug}`;
                return (
                  <li key={link.id}>
                    <Link href={href} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact Information
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              {address && (
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                  <span>{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                  <a href={`tel:${phone}`} className="hover:text-white">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                  <a href={`mailto:${email}`} className="hover:text-white">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-slate-500">
          {settings?.footer_text ??
            `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}