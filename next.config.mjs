/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/stock/v2/',
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
