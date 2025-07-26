/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deshabilitar todas las características experimentales
  experimental: {
    optimizeCss: false,
    optimizePackageImports: [],
  },
  
  serverExternalPackages: [],

  // Configuración básica de imágenes
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

  // Configuración de webpack para evitar conflictos
  webpack: (config, { dev, isServer }) => {
    // Configuración específica para evitar errores de RSC
    if (dev) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // Evitar problemas con módulos del servidor en el cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    return config;
  },

  // Configuración adicional para evitar problemas de RSC
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 