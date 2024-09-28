#!/usr/bin/env node

const path = require('path');
const webpack = require('webpack');
const { ASTObfuscateClassnamesPlugin } = require('../dist/cli.js');
const { createConfigItem } = require('next/dist/build/webpack-config');
const loadConfig = require('next/dist/server/config').default;

async function getWebpackConfig() {
  const nextConfig = await loadConfig('production', process.cwd());
  const webpackConfig = await createConfigItem({ 
    runWebpackSpan: { traceChild: () => ({}) },
    config: nextConfig,
    compilerType: 'client',
    entrypoints: {},
    pagesDir: '',
    rewrites: { fallback: [], afterFiles: [], beforeFiles: [] },
    isDevFallback: false,
    reactProductionProfiling: false,
    noMangling: false,
    clientRouterFilters: undefined,
    previewModeId: '',
    fetchCacheKeyPrefix: '',
  });
  return webpackConfig;
}

getWebpackConfig().then((webpackConfig) => {
  // Add your custom plugin to the Webpack config
  webpackConfig.plugins.push(new ASTObfuscateClassnamesPlugin({
    cuidLength: 8,
  }));

  // Create a compiler instance with the updated Webpack config
  const compiler = webpack(webpackConfig);

  // Run the compiler
  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(stats.toString({
      colors: true,
    }));
  });
}).catch((err) => {
  console.error('Error fetching Webpack configuration:', err);
  process.exit(1);
});