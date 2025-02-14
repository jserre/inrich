/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false, // Enforce strict TypeScript checking
  },
  eslint: {
    ignoreDuringBuilds: false, // Enforce ESLint rules
  },
}

module.exports = nextConfig
