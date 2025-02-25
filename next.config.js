/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["placehold.co"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  // パフォーマンスとセキュリティの設定
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig;
