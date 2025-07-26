/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración experimental avanzada
  experimental: {
    appDir: true,
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', 'lucide-react', '@/components', '@/lib'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Optimización de imágenes avanzada
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 año
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compresión y optimización
  compress: true,
  poweredByHeader: false,

  // Headers de seguridad y cache avanzados
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=604800',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },

  // Webpack optimizations avanzadas
  webpack: (config, { dev, isServer }) => {
    // Optimizaciones solo para producción
    if (!dev && !isServer) {
      // Bundle splitting optimizado
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Chunk principal
          main: {
            name: 'main',
            chunks: 'all',
            minChunks: 1,
            priority: 20,
            reuseExistingChunk: true,
          },
          // Chunk de componentes
          components: {
            name: 'components',
            chunks: 'all',
            minChunks: 2,
            priority: 15,
            reuseExistingChunk: true,
            test: /[\\/]components[\\/]/,
          },
          // Chunk de utilidades
          utils: {
            name: 'utils',
            chunks: 'all',
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
            test: /[\\/]lib[\\/]/,
          },
          // Chunk de vendor (librerías)
          vendor: {
            name: 'vendor',
            chunks: 'all',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
            test: /[\\/]node_modules[\\/]/,
          },
        },
      };

      // Minificación avanzada
      config.optimization.minimize = true;
      config.optimization.minimizer = config.optimization.minimizer || [];
    }

    // Optimización de fuentes
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name].[hash][ext]',
      },
    });

    // Optimización de SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // Configuración de trailing slash
  trailingSlash: false,

  // Configuración de output
  output: 'standalone',

  // Configuración de swc minify
  swcMinify: true,
};

module.exports = nextConfig; 