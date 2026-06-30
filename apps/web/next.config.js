const withSerwist = require("@serwist/next").default({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
});

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@constructos/ui', '@constructos/utils', '@constructos/types'],


  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://maal-material.onrender.com/api/v1/:path*',
      },
    ];
  },
};

module.exports = withSerwist(nextConfig);
