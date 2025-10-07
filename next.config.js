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
  async redirects() {
    return [
      // Redirect old cluster routes to new project routes
      {
        source: '/resonant/:slug',
        destination: '/projects/:slug',
        permanent: true,
      },
      {
        source: '/errant/:slug',
        destination: '/projects/:slug',
        permanent: true,
      },
      {
        source: '/fractured/:slug',
        destination: '/projects/:slug',
        permanent: true,
      },
      {
        source: '/enclosed/:slug',
        destination: '/projects/:slug',
        permanent: true,
      },
    ];
  },
};
