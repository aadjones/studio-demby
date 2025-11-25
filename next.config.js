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
      // Redirect old cluster routes to featured
      {
        source: '/resonant/:slug',
        destination: '/featured/:slug',
        permanent: true,
      },
      {
        source: '/errant/:slug',
        destination: '/featured/:slug',
        permanent: true,
      },
      {
        source: '/fractured/:slug',
        destination: '/featured/:slug',
        permanent: true,
      },
      {
        source: '/enclosed/:slug',
        destination: '/featured/:slug',
        permanent: true,
      },
      // Redirect /projects/* to /featured/*
      {
        source: '/projects/:slug*',
        destination: '/featured/:slug*',
        permanent: true,
      },
      // Redirect old contrapose routes to new location
      {
        source: '/contrapose/:path*',
        destination: '/featured/contrapose/:path*',
        permanent: true,
      },
    ];
  },
};
