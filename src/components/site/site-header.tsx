'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, Menu, X, ArrowRight } from 'lucide-react';
import type { SiteSettings, NavLink } from '@/lib/site-data';
import { EditableText, EditableImage } from './editor';

export function SiteHeader({
  slug,
  settings,
  navLinks,
}: {
  slug: string;
  settings: SiteSettings | null;
  navLinks: NavLink[];
}) {
  const [open, setOpen] = useState(false);
  const companyName = settings?.company_name ?? 'Company Name';
  const phone = settings?.phone ?? '';
  const email = settings?.email ?? '';
  const whatsapp = settings?.whatsapp ?? '';

  return (
    <header className="glass-nav sticky top-0 z-50 w-full">
      {/* 顶部联系条 */}
      <div className="hidden border-b border-white/40 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs text-slate-500">
          <div className="flex items-center gap-5">
            <EditableText field="settings.companyName" label="公司名称" value={companyName}>
            <span className="font-semibold text-slate-700">{companyName}</span>
          </EditableText>
            <span className="hidden items-center gap-1.5 lg:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-slate-500">We respond within 24 hours</span>
            </span>
          </div>
          <div className="flex items-center gap-5">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1.5 transition-colors hover:text-primary"
              >
                <Phone className="h-3.5 w-3.5" />
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-1.5 transition-colors hover:text-primary"
              >
                <Mail className="h-3.5 w-3.5" />
                {email}
              </a>
            )}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-primary"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 主导航 */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href={`/${slug}`} className="flex items-center gap-2.5">
          {settings?.logo_url ? (
            <EditableImage
              field="settings.logo"
              label="站点 Logo"
              value={settings.logo_url}
              alt={companyName}
              imgClassName="h-10 w-auto object-contain"
            />
          ) : (
            <EditableText
              field="settings.companyName"
              label="公司名称"
              value={companyName}
            >
              <span className="text-lg font-bold tracking-tight text-foreground">
                {companyName}
              </span>
            </EditableText>
          )}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const href = link.href ? `/${slug}/${link.href}` : `/${slug}`;
            return (
              <Link
                key={link.id}
                href={href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white/60 hover:text-primary"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={`/${slug}/contact`}
            className="sheen hidden items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:brightness-105 sm:inline-flex"
          >
            Request a Quote
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="glass-btn inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* 移动端抽屉 */}
      {open && (
        <div className="border-t border-white/40 px-6 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const href = link.href ? `/${slug}/${link.href}` : `/${slug}`;
              return (
                <Link
                  key={link.id}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white/60 hover:text-primary"
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href={`/${slug}/contact`}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              Request a Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}