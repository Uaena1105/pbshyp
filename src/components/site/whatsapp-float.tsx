'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppFloat({
  whatsapp,
  label = 'WhatsApp Us',
}: {
  whatsapp?: string;
  label?: string;
}) {
  if (!whatsapp) return null;
  const number = whatsapp.replace(/[^0-9]/g, '');
  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-btn fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-emerald-700 transition-all hover:-translate-y-1"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
        <MessageCircle className="h-4 w-4" />
      </span>
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}