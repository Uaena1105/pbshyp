# 项目上下文

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
│   ├── build.sh            # 构建脚本
│   ├── dev.sh              # 开发环境启动脚本
│   ├── prepare.sh          # 预处理脚本
│   └── start.sh            # 生产环境启动脚本
├── src/
│   ├── app/                # 页面路由与布局
│   ├── components/ui/      # Shadcn UI 组件库
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库
│   │   └── utils.ts        # 通用工具函数 (cn)
│   └── server.ts           # 自定义服务端入口
├── next.config.ts          # Next.js 配置
├── package.json            # 项目依赖管理
└── tsconfig.json           # TypeScript 配置
```

- 项目文件（如 app 目录、pages 目录、components 等）默认初始化到 `src/` 目录下。

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。
**常用命令**：
- 安装依赖：`pnpm add <package>`
- 安装开发依赖：`pnpm add -D <package>`
- 安装所有依赖：`pnpm install`
- 移除依赖：`pnpm remove <package>`

## 开发规范

### 编码规范

- 默认按 TypeScript `strict` 心智写代码；优先复用当前作用域已声明的变量、函数、类型和导入，禁止引用未声明标识符或拼错变量名。
- 禁止隐式 `any` 和 `as any`；函数参数、返回值、解构项、事件对象、`catch` 错误在使用前应有明确类型或先完成类型收窄，并清理未使用的变量和导入。

### next.config 配置规范

- 配置的路径不要写死绝对路径，必须使用 path.resolve(__dirname, ...)、import.meta.dirname 或 process.cwd() 动态拼接。

### Hydration 问题防范

1. 严禁在 JSX 渲染逻辑中直接使用 typeof window、Date.now()、Math.random() 等动态数据。**必须使用 'use client' 并配合 useEffect + useState 确保动态内容仅在客户端挂载后渲染**；同时严禁非法 HTML 嵌套（如 <p> 嵌套 <div>）。
2. **禁止使用 head 标签**，优先使用 metadata，详见文档：https://nextjs.org/docs/app/api-reference/functions/generate-metadata
   1. 三方 CSS、字体等资源可在 `globals.css` 中顶部通过 `@import` 引入或使用 next/font
   2. preload, preconnect, dns-prefetch 通过 ReactDOM 的 preload、preconnect、dns-prefetch 方法引入
   3. json-ld 可阅读 https://nextjs.org/docs/app/guides/json-ld

## UI 设计与组件规范 (UI & Styling Standards)

- 模板默认预装核心组件库 `shadcn/ui`，位于`src/components/ui/`目录下
- Next.js 项目**必须默认**采用 shadcn/ui 组件、风格和规范，**除非用户指定用其他的组件和规范。**

## 项目特性：多站点 CMS 系统

本项目是一个「多站点企业官网 CMS」，复刻外贸工厂官网（塑料制品行业）UI，支持多行业商品展示与总部后台统一管理。

### 默认账号
- 后台地址：`/admin`
- 默认管理员：`admin` / `admin123`（首次访问 `/api/init` 自动创建）

### 路由结构
- `src/app/[slug]/` - 站点前端（`slug` 为站点路径，如 `/1`、`/2`）
  - `page.tsx` 首页；`products/` 产品中心；`products/[productSlug]/` 产品详情
  - `about/` 关于我们；`news/` 新闻列表；`news/[newsSlug]/` 新闻详情；`contact/` 联系我们
- `src/app/admin/` - 后台（`login` 登录；`(dashboard)` 站点列表与站点编辑器）
- `src/app/api/admin/` - 后台 API（登录鉴权 + 站点/设置/轮播/分类/产品/新闻/导航 CRUD）
- `src/app/api/admin/upload/` - 图片上传（鉴权，返回 `key://` 对象存储键）
- `src/app/api/admin/sites/[id]/dashboard/` - 后台聚合接口（站点/设置/轮播/分类/产品/新闻/导航一次返回）
- `src/app/api/media/[...key]/` - 媒体对象存储代理（`key://` 前缀 → 签名 URL 302）
- `src/app/api/init/` - 初始化示例数据

### 数据库表（Supabase / PostgreSQL）
`admins`、`admin_sessions`、`sites`、`site_settings`、`nav_links`、`pages`、`categories`、`products`、`banners`、`news`

### 关键实现
- 鉴权：`src/lib/admin-auth.ts` + `src/lib/admin-request.ts`（session token 存 `admin_sessions`，cookie `admin_token`）
- 前端数据读取：`src/lib/site-data.ts`（`getSiteBySlug` / `getSiteSettings` / `getNavLinks` / `getProducts` 等）
- 站点前端组件：`src/components/site/`（header / footer / home-content / whatsapp-float / contact-form）
- 后台组件：`src/components/admin/`（sites-manager / site-editor / visual-editor / settings-tab / banners-tab / categories-tab / products-tab / news-tab / nav-tab）

### 可视化所见即所得编辑（WYSIWYG）
- 站点所有文案/图片均可「小铅笔」点击编辑：`src/components/site/editor.tsx` 提供 `EditorProvider` / `useEditor` / `EditableText` / `EditableImage`
  - `EditableText` 采用 children 渲染模式（`children` 必填包裹展示内容），`EditableImage` 处理 `key://` 图片为空时的占位
- 首页可变文案数据化：`site_settings.home_content`（jsonb）承载 hero 标签、优势区、生产流程、数据统计、关于、CTA 等
  - 类型与默认值：`src/lib/site-data.ts` 的 `HomeContent` / `getDefaultHomeContent()` / `resolveHomeContent()`
- 后台可视化编辑器：`src/components/admin/visual-editor.tsx`（读取 dashboard 聚合接口，按 field 前缀路由保存）
- 编辑字段命名约定：
  - `settings.<camelCase>` → 通过 `SETTINGS_FIELDS` 映射到 `site_settings` 的 snake_case 列（如 `settings.companyName` → `company_name`、`settings.logo` → `logo_url`）
  - `home.<path>` → 写入 `home_content`（`deepSet` 深路径更新）
  - `category.<id>.<key>` / `product.<id>.<key>` / `banner.<id>.<key>` / `news.<id>.<key>` → 对应 CRUD 接口
- 行业模板一键建站：`src/lib/site-templates.ts`（`TEMPLATES` + `getTemplateData()`），`POST /api/admin/sites` 传 `template` 即时创建完整站点
- 对象存储：`src/lib/storage.ts`（`getStorage()`，仅服务端）；客户端用 `src/lib/media.ts` 的纯函数 `imgSrc()` 做 `key://` 前缀解析
- 自定服务端 `src/server.ts`：生产由 `scripts/start.sh` 用 `node dist/server.js` 启动；**不要**手动 `url.parse(req.url)` 再传给 `handle`（`url.parse` 的 pathname 不解码 `%5Bid%5D`，会导致含方括号的动态路由 chunk 静态文件 404 + 前端 `ChunkLoadError`），直接 `handle(req, res)` 让 Next.js 自行解析即可

### 数据库模型维护
- 表结构定义：`src/storage/database/shared/schema.ts`
- 修改 schema 后执行 `coze-coding-ai db upgrade` 同步数据库
