/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/task-manager' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/task-manager/' : '',
  images: {
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;