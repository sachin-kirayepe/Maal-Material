const withSerwist = require("@serwist/next").default({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
});

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@constructos/ui', '@constructos/utils', '@constructos/types'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@tanstack/react-table', 'framer-motion'],
  },

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
};

module.exports = withSerwist(nextConfig);
