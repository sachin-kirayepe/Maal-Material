const withSerwist = require("@serwist/next").default({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // C-04 FIX: Re-enable TypeScript type checking for production safety
    ignoreBuildErrors: false,
  },
  eslint: {
    // C-04 FIX: Re-enable ESLint checking for production safety
    ignoreDuringBuilds: false,
  },
};

module.exports = withSerwist(nextConfig);
