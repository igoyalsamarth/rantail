import crypto from 'crypto';
import { transformSync } from '@babel/core';
import { readFileSync } from 'fs';
import webpack from 'webpack'; // Import Webpack utilities

class TailwindObfuscatorPlugin {
  constructor(options = {}) {
    this.options = {
      outputPath: 'styles/obfuscated-classes.css',
      ...options
    };
    this.classMap = new Map();
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(
      'TailwindObfuscatorPlugin',
      (compilation) => {
        compilation.hooks.processAssets.tapAsync(
          {
            name: 'TailwindObfuscatorPlugin',
            stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS, // Choose appropriate stage
          },
          (assets, callback) => {
            const jsxFiles = Array.from(compilation.fileDependencies).filter(file =>
              /\.(js|jsx|tsx)$/.test(file)
            );

            jsxFiles.forEach(file => {
              console.log(`Processing file: ${file}`);
              if (assets[file]) { // Ensure the asset exists
                const content = readFileSync(file, 'utf8');
                const result = this.transformCode(content, file);

                // Update the asset using RawSource
                compilation.updateAsset(
                  file,
                  new webpack.sources.RawSource(result)
                );
              
              }
            });

            const cssContent = this.generateCssContent();

            // Emit the CSS file using RawSource
            compilation.emitAsset(
              this.options.outputPath,
              new webpack.sources.RawSource(cssContent)
            );

            callback();
          }
        );
      }
    );
  }

  transformCode(code, filename) {
    const result = transformSync(code, {
      filename,
      plugins: [this.babelPlugin()]
    });
    return result?.code || code;
  }

  babelPlugin() {
    const self = this;
    return {
      visitor: {
        JSXAttribute(path) {
          if (
            path.node.name.name === 'className' &&
            path.node.value.type === 'StringLiteral'
          ) {
            const classes = path.node.value.value.split(' ');
            const obfuscatedClasses = classes.map(className => self.obfuscateClass(className));
            path.node.value.value = obfuscatedClasses.join(' ');
          }
        }
      }
    };
  }

  obfuscateClass(className) {
    if (!this.classMap.has(className)) {
      this.classMap.set(className, this.generateCUID());
    }
    return this.classMap.get(className);
  }

  generateCUID() {
    return crypto.randomBytes(8).toString('hex');
  }

  generateCssContent() {
    return Array.from(this.classMap.entries())
      .map(([original, obfuscated]) => `.${obfuscated} { @apply ${original}; }`)
      .join('\n');
  }
}

export default TailwindObfuscatorPlugin;