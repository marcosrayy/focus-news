/** @type {import('next').NextConfig} */

const nextConfig = {
  distDir: ".next-runtime",

  typescript: {
    ignoreBuildErrors: true,
  },

  devIndicators: false,
};

export default nextConfig;