import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { ASTObfuscateClassnamesPlugin } from './src/cli';

module.exports = {
  mode: 'production', // Set to 'development' for easier debugging
  entry: './src/index.ts', // Entry point of your library
  output: {
    filename: 'bundle.js', // Output filename
    path: path.resolve(__dirname, 'dist'), // Output directory
    library: 'YourLibraryName', // Global variable name for the library
    libraryTarget: 'umd', // Universal Module Definition
  },
  resolve: {
    extensions: ['.ts', '.js'], // Extensions to resolve
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader', // Use ts-loader for TypeScript files
        exclude: /node_modules/,
      },
      // Add any other loaders here (e.g., for CSS, images)
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // Clean dist folder before each build
    new ASTObfuscateClassnamesPlugin({
      cuidLength: 8,
      prefix: 'my-prefix-',
      outputCss: 'dist/styles.css',
      outputJson: 'dist/classnames.json',
    }),
  ],
};