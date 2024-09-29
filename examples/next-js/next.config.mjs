import {ASTObfuscateClassnamesPlugin} from 'rantail'; // Import your plugin
import path from 'path';
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add your custom plugin to the existing plugins array
    config.plugins.push(new ASTObfuscateClassnamesPlugin({
      cuidLength: 8,
      prefix: '',
      suffix: '',
      ignorePrefix: '',
      outputCss: path.join(process.cwd(), 'app', 'global.css'),
    }));
    
    const cssRule = config.module.rules.find(
      (rule) => rule.test && rule.test.toString().includes('css')
    );
    
    if (cssRule && cssRule.use) {
      cssRule.use.unshift({
        loader: path.resolve(__dirname, 'node_modules/rantail/bin/rantail.cjs'),
        options: {
          // Add options if needed
        },
      });
    }

    // Return the modified config
    return config;
  },
};

export default nextConfig;