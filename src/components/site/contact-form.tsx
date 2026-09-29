'use client';

import { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';

export function ContactForm({ whatsapp }: { whatsapp?: string }) {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // 如果有 WhatsApp，构造成询价消息并跳转
    if (whatsapp) {
      const number = whatsapp.replace(/[^0-9]/g, '');
      const text = encodeURIComponent(
        `Inquiry from ${form.name}${form.company ? ` (${form.company})` : ''}\n` +
          `Email: ${form.email}\n` +
          `Phone/WhatsApp: ${form.phone}\n` +
          `Product of Interest: ${form.product}\n` +
          `Message: ${form.message}`,
      );
      window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-medium text-green-800">
          Thank you for your inquiry! We will respond within 24 hours.
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Your Name *</label>
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Company Name</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            className={inputClass}
            placeholder="Company name"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email Address *</label>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Phone / WhatsApp</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="+86 ..."
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Product of Interest</label>
        <input
          name="product"
          value={form.product}
          onChange={handleChange}
          className={inputClass}
          placeholder="Which product are you interested in?"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Message / Inquiry Details *
        </label>
        <textarea
          required
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          className={inputClass}
          placeholder="Tell us your requirements..."
        />
      </div>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
      >
        <Send className="h-4 w-4" />
        Send an Inquiry
      </button>
      {whatsapp && (
        <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <MessageCircle className="h-4 w-4 text-green-600" />
          Prefer WhatsApp? We respond within 24 hours.
        </p>
      )}
    </form>
  );
}