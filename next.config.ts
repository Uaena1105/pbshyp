import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // 消除多 lockfile（沙箱根目录 /pnpm-lock.yaml 与项目 pnpm-lock.yaml 并存）导致的
  // "Next.js inferred your workspace root, but it may not be correct" 告警
  outputFileTracingRoot: process.cwd(),
  serverExternalPackages: ['coze-coding-dev-sdk'],
  webpack: (config, { dev }) => {
    if (dev && config.cache && config.cache.type === 'filesystem') {
      config.cache.cacheDirectory = path.resolve(
        'node_modules/.cache/next-webpack',
      );
    }
    return config;
  },
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
