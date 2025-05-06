/** @type {import('next').NextConfig} */
module.exports = {
  webpack(config, { isServer }) {
    if (!isServer) config.externals = [...(config.externals || []), "p5"];
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
