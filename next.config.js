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
      // Old listing pages → /work
      { source: '/featured', destination: '/work', permanent: true },
      { source: '/activity', destination: '/work', permanent: true },
      { source: '/everything', destination: '/work', permanent: true },
      { source: '/recent', destination: '/work', permanent: true },
      { source: '/sound-vision', destination: '/work', permanent: true },
      { source: '/systems-tools', destination: '/work', permanent: true },
      { source: '/provocations', destination: '/work', permanent: true },
      { source: '/practice-pedagogy', destination: '/work', permanent: true },

      // Old slug routes → /work/:slug
      { source: '/featured/:slug', destination: '/work/:slug', permanent: true },
      { source: '/activity/:slug', destination: '/work/:slug', permanent: true },

      // Old cluster routes → /work/:slug
      { source: '/resonant/:slug', destination: '/work/:slug', permanent: true },
      { source: '/errant/:slug', destination: '/work/:slug', permanent: true },
      { source: '/fractured/:slug', destination: '/work/:slug', permanent: true },
      { source: '/enclosed/:slug', destination: '/work/:slug', permanent: true },
      { source: '/projects/:slug*', destination: '/work/:slug*', permanent: true },

      // Contrapose special routes
      { source: '/featured/contrapose/:path*', destination: '/work/contrapose/:path*', permanent: true },
      { source: '/contrapose/:path*', destination: '/work/contrapose/:path*', permanent: true },
    ];
  },
};
