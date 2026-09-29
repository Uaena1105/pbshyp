'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '登录失败');
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-foreground placeholder:text-slate-400 backdrop-blur transition-all focus:border-primary focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/30';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">用户名</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClass}
          placeholder="admin"
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">密码</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="••••••••"
          required
        />
      </div>
      {error && (
        <div className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        登录后台
      </button>
      <p className="text-center text-xs text-slate-400">默认账号：admin / admin123</p>
    </form>
  );
}