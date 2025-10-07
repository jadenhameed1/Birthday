/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // or remove output completely
  // Or use this for SSR instead of static export:
  // trailingSlash: true,
}

module.exports = nextConfig
