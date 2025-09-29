/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // missingSuspenseWithCSRBailout has been removed in newer Next.js versions
  },
  // Allow all hosts for Replit proxy support (handled by dev server -H flag)
  // Add dev server stability options
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      // period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: 25 * 1000,
      // number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 2,
    },
  }),
  webpack: (config, { isServer }) => {
    // Exclude Node.js modules from client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        url: false,
      }

      // Exclude pg and related modules from client bundle
      config.externals = config.externals || []
      config.externals.push({
        'pg': 'commonjs pg',
        'pg-connection-string': 'commonjs pg-connection-string',
        'pgpass': 'commonjs pgpass'
      })
    }

    return config
  },
  serverExternalPackages: ['pg', 'pg-connection-string', 'pgpass', 'bcryptjs', 'jsonwebtoken', 'nodemailer'],
  output: 'standalone',
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  trailingSlash: false,
  // Ensure proper port configuration for deployment
  ...(process.env.NODE_ENV === 'production' && {
    env: {
      PORT: '80'
    }
  }),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    domains: [],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/files/uploads/:path*',
      },
    ]
  },
  // Disable static optimization for deployment
  staticPageGenerationTimeout: 1000,
  generateBuildId: async () => {
    // Generate a unique build ID to prevent caching issues
    return Date.now().toString()
  },
  // Add headers to prevent caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ]
  },
}

export default nextConfig