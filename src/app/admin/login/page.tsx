import { LoginForm } from '@/components/admin/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-slate-900">多站点 CMS 管理后台</h1>
            <p className="mt-1 text-sm text-slate-500">登录以管理你的所有站点</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}