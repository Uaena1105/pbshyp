'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, LayoutDashboard, LogOut } from 'lucide-react';

export function AdminShell({
  admin,
  children,
}: {
  admin: { id: number; username: string; is_super: boolean };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="aurora left-[-10%] top-[-10%] h-[30rem] w-[30rem] bg-sky-400/25" />
        <div
          className="aurora right-[-5%] bottom-[-10%] h-[26rem] w-[26rem] bg-violet-400/20"
          style={{ animationDelay: '-8s' }}
        />
      </div>

      {/* 侧边栏 */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-white/10 bg-slate-900/85 backdrop-blur-2xl md:flex">
        <div className="flex items-center gap-2.5 px-5 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20">
            <Globe className="h-5 w-5 text-sky-400" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">多站点 CMS</span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          <Link
            href="/admin"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === '/admin'
                ? 'bg-white/15 text-white'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            站点管理
          </Link>
        </nav>
        <div className="border-t border-white/10 px-3 py-4">
          <div className="mb-2 px-3 text-xs text-slate-400">当前用户：{admin.username}</div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </button>
        </div>
      </aside>

      {/* 主内容 */}
      <div className="flex-1 md:pl-60">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}