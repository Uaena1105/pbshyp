import Link from 'next/link';
import { Phone, Mail, MessageCircle, Menu, ChevronDown } from 'lucide-react';
import type { SiteSettings, NavLink } from '@/lib/site-data';

export function SiteHeader({
  slug,
  settings,
  navLinks,
}: {
  slug: string;
  settings: SiteSettings | null;
  navLinks: NavLink[];
}) {
  const companyName = settings?.company_name ?? 'Company Name';
  const phone = settings?.phone ?? '';
  const email = settings?.email ?? '';
  const whatsapp = settings?.whatsapp ?? '';

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* 顶部联系条 */}
      <div className="hidden border-b border-slate-100 bg-slate-50 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-slate-500">
          <div className="flex items-center gap-5">
            <span className="font-medium text-slate-600">{companyName}</span>
            <span className="hidden items-center gap-1.5 lg:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              We respond within 24 hours
            </span>
          </div>
          <div className="flex items-center gap-5">
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-1.5 hover:text-blue-700">
                <Phone className="h-3.5 w-3.5" />
                {phone}
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-blue-700">
                <Mail className="h-3.5 w-3.5" />
                {email}
              </a>
            )}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-blue-700"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 主导航 */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href={`/${slug}`} className="flex items-center gap-2">
          {settings?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo_url}
              alt={companyName}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span className="font-serif text-lg font-bold text-blue-900">{companyName}</span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const href = link.href ? `/${slug}/${link.href}` : `/${slug}`;
            return (
              <Link
                key={link.id}
                href={href}
                className="text-sm font-medium text-slate-700 transition-colors hover:text-blue-700"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={`/${slug}/contact`}
            className="hidden rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 sm:inline-flex"
          >
            Request Custom Quote
          </Link>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 lg:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 移动端菜单（简化） */}
      <nav className="border-t border-slate-100 px-4 py-2 lg:hidden">
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {navLinks.map((link) => {
            const href = link.href ? `/${slug}/${link.href}` : `/${slug}`;
            return (
              <Link
                key={link.id}
                href={href}
                className="text-sm text-slate-700 hover:text-blue-700"
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}