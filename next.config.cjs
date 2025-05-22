const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  webpack(config, { isServer }) {
    // Handle p5.js as an external script
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        p5: path.resolve(__dirname, 'node_modules/p5/lib/p5.js')
      };
    }
    return config;
  },
  images: {
    domains: ['kr3e5ferkjmujweh.public.blob.vercel-storage.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kr3e5ferkjmujweh.public.blob.vercel-storage.com',
      },
    ],
    unoptimized: true, // This will help with local image loading
  },
};
