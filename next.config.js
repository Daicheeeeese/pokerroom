/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placehold.co', 'maps.googleapis.com', 'maps.gstatic.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '*.gstatic.com',
      },
    ],
  },
  // パフォーマンスとセキュリティの設定
  poweredByHeader: false,
  reactStrictMode: true,
  // 本番環境の最適化
  compress: true,
  productionBrowserSourceMaps: false,
  // キャッシュの最適化
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
