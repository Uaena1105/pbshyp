'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import type { SiteSettings, NavLink } from '@/lib/site-data';
import { EditableText } from './editor';

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
    <footer className="relative mt-20 border-t border-white/50 bg-slate-900/80 text-slate-300 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-white">{companyName}</h3>
            <EditableText
              field="settings.seoDescription"
              label="页脚介绍"
              value={settings?.seo_description ?? ''}
              kind="textarea"
            >
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                {settings?.seo_description ??
                  'Quality solutions exported worldwide. Trusted by international buyers.'}
              </p>
            </EditableText>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-400"
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
            <ul className="mt-5 space-y-2.5 text-sm">
              {navLinks.map((link) => {
                const href = link.href ? `/${slug}/${link.href}` : `/${slug}`;
                return (
                  <li key={link.id}>
                    <Link href={href} className="text-slate-400 transition-colors hover:text-white">
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
            <ul className="mt-5 space-y-3.5 text-sm text-slate-400">
              {address && (
                <li className="flex gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                  <span>{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                  <a href={`tel:${phone}`} className="hover:text-white">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                  <a href={`mailto:${email}`} className="hover:text-white">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-slate-500">
          <EditableText
            field="settings.footerText"
            label="版权文字"
            value={settings?.footer_text ?? ''}
            wrapperClassName="inline-flex"
          >
            <span>
              {settings?.footer_text ??
                `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`}
            </span>
          </EditableText>
        </div>
      </div>
    </footer>
  );
}