import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '企业官网管理平台',
    template: '%s | 企业官网管理平台',
  },
  description:
    '多站点企业官网内容管理系统，支持多行业商品展示与总部后台统一管理。',
  keywords: [
    '企业官网',
    '内容管理系统',
    '多站点管理',
    'CMS',
    '外贸官网',
    '产品展示',
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}