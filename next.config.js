/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
  },
  env: {
    FILECOIN_RPC_URL: process.env.FILECOIN_RPC_URL,
    LOTUS_ENDPOINT: process.env.LOTUS_ENDPOINT,
    LOTUS_TOKEN: process.env.LOTUS_TOKEN,
  },
}

module.exports = nextConfig
