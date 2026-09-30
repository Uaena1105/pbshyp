# 多站点企业官网 CMS

多站点企业官网内容管理系统，支持多行业商品展示与总部后台统一管理。前台站点通过 `/{slug}` 访问，后台统一管理所有站点。

## 技术栈

- Next.js 16（App Router）
- React 19 + TypeScript 5
- shadcn/ui（Radix UI）
- Tailwind CSS v4
- Supabase（PostgreSQL）
- S3 兼容对象存储

## 快速开始

```bash
pnpm install
pnpm build
pnpm start
```

默认监听 `5000` 端口，可通过 `PORT` 环境变量指定。

## 环境变量

在根目录创建 `.env` 文件：

```bash
COZE_SUPABASE_URL=...
COZE_SUPABASE_ANON_KEY=...
COZE_SUPABASE_SERVICE_ROLE_KEY=...

S3_ENDPOINT=...
S3_REGION=...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=...
```

## 初始化

1. 在数据库中执行 `db/schema.sql` 建表。
2. 启动后访问 `http://localhost:5000/api/init` 创建默认管理员与示例站点。
3. 访问 `http://localhost:5000/admin` 登录后台（默认 `admin` / `admin123`）。

## 部署

完整部署说明（含对象存储自托管改造）见 [DEPLOY.md](./DEPLOY.md)。

## 目录结构

```
src/
├── app/              # 页面路由与 API
├── components/       # 站点与后台组件
├── lib/              # 数据读取、鉴权、存储等工具
├── storage/          # 数据库 schema 与客户端
└── server.ts         # 自定义服务端入口
db/                   # 数据库初始化脚本
scripts/              # 构建与启动脚本
```