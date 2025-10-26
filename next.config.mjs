/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/stock',
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    instrumentationHook: true,
  },
  output: 'standalone',
};

export default nextConfig;
