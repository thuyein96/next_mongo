/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/stock',
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
