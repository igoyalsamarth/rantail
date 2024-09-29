import TailwindObfuscatorPlugin from './rantail.mjs';

const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!dev && !isServer) {
      config.plugins.push(new TailwindObfuscatorPlugin());
    }
    return config;
  },
};

export default nextConfig;
