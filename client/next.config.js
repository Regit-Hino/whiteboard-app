/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: '/whiteboard-app',
  assetPrefix: '/whiteboard-app/',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig