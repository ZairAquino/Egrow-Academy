/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración mínima para evitar conflictos
  experimental: {
    optimizeCss: false,
    optimizePackageImports: [],
  },

  // Optimización de imágenes básica
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Configuración básica de webpack
  webpack: (config, { dev, isServer }) => {
    // Configuración mínima para desarrollo
    if (dev) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig; 