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
    <div className="flex min-h-screen bg-slate-100">
      {/* 侧边栏 */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-slate-900 md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <Globe className="h-6 w-6 text-white" />
          <span className="text-base font-semibold text-white">多站点 CMS</span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          <Link
            href="/admin"
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${
              pathname === '/admin'
                ? 'bg-slate-800 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            站点管理
          </Link>
        </nav>
        <div className="border-t border-slate-800 px-3 py-4">
          <div className="mb-2 px-3 text-xs text-slate-400">
            当前用户：{admin.username}
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
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