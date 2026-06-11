/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 16: serverExternalPackages replaces serverComponentsExternalPackages
  serverExternalPackages: ['sql.js'],
  // Empty turbopack config to silence the warning
  turbopack: {},
};

module.exports = nextConfig;
