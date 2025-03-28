/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/registry',
        destination: '/agents',
        permanent: true,
      },
      {
        source: '/registry/:id',
        destination: '/agents/:id',
        permanent: true,
      },
    ];
  },
  headers: () => [
    {
      source: '/',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400, s-maxage=86400', // Cache for 1 day
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'Content-Security-Policy',
          value:
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://substackapi.com https://*.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: http:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:;",
        },
      ],
    },
  ],
  experimental: {
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

module.exports = nextConfig;
