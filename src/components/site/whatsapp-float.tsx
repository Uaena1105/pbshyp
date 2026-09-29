'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppFloat({ whatsapp, label = 'WhatsApp Us' }: { whatsapp?: string; label?: string }) {
  if (!whatsapp) return null;
  const number = whatsapp.replace(/[^0-9]/g, '');
  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-green-500"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}