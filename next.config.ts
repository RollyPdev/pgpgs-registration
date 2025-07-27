import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 4,
    workerThreads: false,
  },
  webpack: (config, { isServer }) => {
    // Fix for @react-pdf/renderer
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
      };
    }

    // Handle canvas for @react-pdf/renderer
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    return config;
  },
  transpilePackages: ['@react-pdf/renderer'],
};

export default nextConfig;
