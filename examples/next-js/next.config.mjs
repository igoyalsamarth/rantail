import { ASTObfuscateClassnamesPlugin } from 'rantail';

const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add your custom plugin to the existing plugins array
    config.plugins.push(new ASTObfuscateClassnamesPlugin({
      cuidLength: 8,
      // Add other options as needed
    }));

    // Return the modified config
    return config;
  },
};

export default nextConfig;