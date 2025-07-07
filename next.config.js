/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- Build–time options -----------------------------------------------
  // Removing `output: 'export'` so dynamic API routes are allowed
  // -----------------------------------------------------------------------

  // Skip ESLint errors during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Skip TypeScript type-checking errors during production builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable next/image optimizations (optional—but harmless without `output: 'export'`)
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
