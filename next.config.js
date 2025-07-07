/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  // Skip ESLint errors during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Skip TypeScript type-checking errors during production builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable next/image optimizations (required when using output: 'export')
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
