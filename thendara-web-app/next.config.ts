import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // cycletls resolves its Go helper binary via __dirname; bundling rewrites that to a
  // bogus /ROOT path. Keep it external so the require resolves to real node_modules.
  serverExternalPackages: ['cycletls'],
};

export default nextConfig;
