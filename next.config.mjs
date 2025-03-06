/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    basePath: process.env.NODE_ENV === 'production' ? '/task-manager' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/task-manager/' : '',
    images: {
      unoptimized: true,
    },
    output: 'export',
  }
  
  module.exports = nextConfig

export default nextConfig;
