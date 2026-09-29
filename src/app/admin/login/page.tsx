import { LoginForm } from '@/components/admin/login-form';

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="aurora aurora-animate left-[-10%] top-[-10%] h-[34rem] w-[34rem] bg-sky-400/40" />
        <div
          className="aurora aurora-animate right-[-10%] top-[20%] h-[30rem] w-[30rem] bg-violet-400/30"
          style={{ animationDelay: '-6s' }}
        />
        <div
          className="aurora aurora-animate bottom-[-15%] left-[30%] h-[28rem] w-[28rem] bg-amber-300/25"
          style={{ animationDelay: '-12s' }}
        />
      </div>
      <div className="w-full max-w-sm">
        <div className="glass-card rounded-[2rem] p-8">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">
              多站点 CMS <span className="text-gradient">管理后台</span>
            </h1>
            <p className="mt-2 text-sm text-slate-500">登录以管理你的所有站点</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}