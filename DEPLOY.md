# 部署文档

本项目为「多站点企业官网 CMS」，基于 Next.js 16（App Router）+ Supabase（PostgreSQL）+ S3 兼容对象存储构建。以下说明如何部署到你自己的服务器。

## 一、环境要求

| 项目 | 要求 |
| --- | --- |
| Node.js | 20 及以上（推荐 24 LTS） |
| 包管理器 | pnpm 9 及以上（项目已锁定 pnpm，不可用 npm / yarn） |
| 数据库 | PostgreSQL（推荐 Supabase，也可自建） |
| 对象存储 | S3 兼容（AWS S3 / MinIO / Cloudflare R2 / 阿里云 OSS 等） |
| 系统 | Linux（推荐），需 `bash`、`git` |

## 二、准备外部服务

### 2.1 数据库（Supabase）

1. 注册 [Supabase](https://supabase.com) 并创建项目。
2. 进入项目的 SQL Editor，执行本项目根目录 `db/schema.sql` 中的全部内容，创建 11 张数据表。
3. 在 Project Settings → API 中获取：
   - Project URL（即 `COZE_SUPABASE_URL`）
   - anon public key（即 `COZE_SUPABASE_ANON_KEY`）
   - service_role key（即 `COZE_SUPABASE_SERVICE_ROLE_KEY`）

若使用自建 PostgreSQL，同样执行 `db/schema.sql`，并把三项环境变量指向自建实例的对应接入信息。

### 2.2 对象存储（S3 兼容）

1. 创建存储桶（Bucket），并开启公开读或配置预签名访问能力。
2. 获取接入信息：Endpoint、Region、Access Key、Secret Key、Bucket 名称。

> 重要：项目原代码通过 `coze-coding-dev-sdk` 的 `S3Storage` 访问对象存储，`accessKey` / `secretKey` 为硬编码空字符串，依赖扣子平台注入凭证。**自托管部署前必须改造 `src/lib/storage.ts`**，详见第八节，否则图片上传与媒体代理会失败。

## 三、配置环境变量

在项目根目录创建 `.env` 文件：

```bash
# Supabase / PostgreSQL
COZE_SUPABASE_URL=https://xxxx.supabase.co
COZE_SUPABASE_ANON_KEY=xxxx
COZE_SUPABASE_SERVICE_ROLE_KEY=xxxx

# 对象存储（改造 storage.ts 后使用，见第八节）
S3_ENDPOINT=https://xxxx
S3_REGION=us-east-1
S3_ACCESS_KEY=xxxx
S3_SECRET_KEY=xxxx
S3_BUCKET=my-bucket

# 服务端口（可选，默认 5000）
PORT=5000

# 运行环境
COZE_PROJECT_ENV=PROD
```

## 四、安装依赖与构建

```bash
pnpm install
pnpm build
```

`pnpm build` 会依次执行：安装依赖 → `next build` → 用 tsup 将 `src/server.ts` 打包为 `dist/server.js`。

## 五、启动服务

```bash
pnpm start
```

等价于 `node dist/server.js`，默认监听 5000 端口。自定义端口：

```bash
PORT=8080 node dist/server.js
```

建议在生产环境使用进程守护工具（如 pm2、systemd）托管：

```bash
pnpm add -g pm2
PORT=5000 pm2 start dist/server.js --name cms
pm2 save
```

## 六、初始化站点

服务启动后，浏览器访问一次：

```
http://你的域名/api/init
```

该接口会自动创建默认管理员（`admin` / `admin123`）并写入两个示例站点。

随后访问后台：

```
http://你的域名/admin
```

登录后即可管理站点。前台站点通过 `http://你的域名/{slug}` 访问（示例站点为 `/1`、`/2`）。

## 七、部署到 GitHub 后服务器拉取

```bash
# 服务器上
git clone <你的仓库地址> cms
cd cms
cp .env.example .env   # 若无 example，手动创建 .env 并填入第三节变量
vim .env               # 填写数据库与对象存储配置

pnpm install
pnpm build
pm2 start dist/server.js --name cms
```

> `.env` 不应提交到 Git，已在 `.gitignore` 中忽略。请务必妥善保管其中的密钥。

## 八、对象存储自托管改造（必读）

`src/lib/storage.ts` 当前依赖扣子平台注入凭证，自托管需改为标准 S3 客户端。项目已内置 `@aws-sdk/client-s3` 依赖，可直接使用。

将 `src/lib/storage.ts` 替换为如下实现（保持 `uploadFile` 与 `generatePresignedUrl` 两个方法签名不变，业务代码无需改动）：

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

let client: S3Client | null = null;

function getClient(): S3Client {
  if (!client) {
    client = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
      },
      forcePathStyle: true,
    });
  }
  return client;
}

interface Storage {
  uploadFile(args: { fileContent: Buffer; fileName: string; contentType?: string }): Promise<string>;
  generatePresignedUrl(args: { key: string; expireTime: number }): Promise<string>;
}

export function getStorage(): Storage {
  return {
    async uploadFile({ fileContent, fileName, contentType }) {
      const bucket = process.env.S3_BUCKET;
      const key = fileName;
      await getClient().send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: fileContent,
          ContentType: contentType,
        }),
      );
      return key;
    },
    async generatePresignedUrl({ key, expireTime }) {
      const bucket = process.env.S3_BUCKET;
      const url = await getSignedUrl(
        getClient(),
        new GetObjectCommand({ Bucket: bucket, Key: key }),
        { expiresIn: expireTime },
      );
      return url;
    },
  };
}
```

改造完成后，在 `.env` 中配置第三节的 `S3_*` 变量即可。