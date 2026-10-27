/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kr3e5ferkjmujweh.public.blob.vercel-storage.com',
      },
    ],
  },
  async rewrites() {
    return {
      // beforeFiles: a plain array only runs after Next has matched a page file, and
      // /work has one, so the rewrite would never apply.
      beforeFiles: [
        // Serve /work?category=<slug> from a page prebuilt with that category selected,
        // so shared links show the right cards before JavaScript loads. The URL is unchanged.
        {
          source: '/work',
          has: [{ type: 'query', key: 'category', value: '(?<category>[a-z-]+)' }],
          destination: '/work/by-category/:category',
        },
      ],
    };
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

      // Renamed slugs
      { source: '/work/ad-libitum', destination: '/work/birdsong-elegies', permanent: true },

      // Contrapose special routes
      { source: '/featured/contrapose/:path*', destination: '/work/contrapose/:path*', permanent: true },
      { source: '/contrapose/:path*', destination: '/work/contrapose/:path*', permanent: true },

      // Standalone articles (skip the project page, go straight to the article)
      { source: '/work/sack-vulnerability', destination: '/standalone/sack-vulnerability/index.html', permanent: false },
    ];
  },
};
