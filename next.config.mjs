import { fileURLToPath } from 'node:url';
import createJiti from 'jiti';

// Import env here to validate during build. Using jiti we can import .ts files :)
createJiti(fileURLToPath(import.meta.url))('./src/env/index.mjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
};

export default nextConfig;
