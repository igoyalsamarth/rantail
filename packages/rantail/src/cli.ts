import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { generateCUID } from './utils/cuid';
import { Compiler, Compilation, sources } from 'webpack';
import * as fs from 'fs';
import { Source } from 'webpack-sources';
import path from 'path';

interface ASTObfuscateClassnamesPluginOptions {
  cuidLength?: number;
  prefix?: string;
  suffix?: string;
  ignorePrefix?: string;
  outputCss?: string;
  outputJson?: string;
}

// Custom source class
class CustomSource implements Source {
  private content: string;
  private sourceMap: any;

  constructor(content: string, sourceMap: any = null) {
    this.content = content;
    this.sourceMap = sourceMap;
  }

  public getContent(): string {
    return this.content;
  }

  buffer(): Buffer {
    return Buffer.from(this.content); // Convert string content to a Buffer
  }

  source(): string {
    return this.content;
  }

  size(): number {
    return this.content.length;
  }

  map(): any {
    return this.sourceMap;
  }

  sourceAndMap(): { source: string; map: any } {
    return { source: this.content, map: this.sourceMap };
  }

  updateHash(hash: any): void {
    // Implement the hash update logic if necessary
  }
}

export class ASTObfuscateClassnamesPlugin {
  private config: ASTObfuscateClassnamesPluginOptions;
  private classReplacements: Record<string, string>;

  constructor(options: ASTObfuscateClassnamesPluginOptions = {}) {
    this.config = options;
    this.classReplacements = {};
  }

  apply(compiler: Compiler): void {
    console.log('ASTObfuscateClassnamesPlugin is running...');

    compiler.hooks.thisCompilation.tap('ASTObfuscateClassnamesPlugin', (compilation: Compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: 'ASTObfuscateClassnamesPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_DEV_TOOLING, // Choose the right stage
        },
        (assets, callback) => {
          const { cuidLength = 8, ignorePrefix = '', outputCss } = this.config;

          for (const assetName in assets) {
            if (/\.(js|jsx|ts|tsx)$/.test(assetName) && assetName.includes('/app/') && !assetName.includes('chunks') && !assetName.includes('not-found') && !assetName.includes('favicon')) {
              console.log(assetName)
              //console.log('Full path:', fullPath);
              let sourceCode = assets[assetName].buffer().toString('utf-8');
              const ast = parse(sourceCode, {
                sourceType: 'module',
                plugins: ['jsx', 'typescript'],
              });
              //console.log('ast', ast)
              traverse(ast, {
                JSXAttribute: (path) => {
                  console.log('JSXAttribute:', path);
                  //console.log('JSXAttribute:', path);
                  if (path.node.name.name === 'className') {
                    const valueNode = path.node.value;
                    console.log('valueNode', valueNode)

                    if (valueNode) {
                      let classNames: string[] = [];

                      if (valueNode.type === 'StringLiteral') {
                        classNames = valueNode.value.split(' ');
                      } else if (valueNode.type === 'JSXExpressionContainer') {
                        if (valueNode.expression.type === 'Identifier') {
                          classNames = [valueNode.expression.name];
                        }
                      }

                      const obfuscatedClassNames = classNames.map((className: string) => {
                        if (ignorePrefix.length > 0 && className.startsWith(ignorePrefix)) return className;

                        if (className.length === 0) return className;

                        if (!this.classReplacements[className]) {
                          this.classReplacements[className] = generateCUID(cuidLength);
                        }
                        return this.classReplacements[className];
                      });

                      path.node.value = {
                        type: 'StringLiteral',
                        value: obfuscatedClassNames.join(' '),
                      } as any; // Cast to `any`
                    }
                  }
                },
              });

              const output = generate(ast, {}, sourceCode).code;

              //console.log('output', output)

              // Use CustomSource instead of RawSource or OriginalSource
              //const customSource = new CustomSource(output);
              assets[assetName] = new sources.RawSource(output);


              // Write the modified source code back to the file
              //fs.writeFileSync(fullPath, sourceCode, 'utf-8');


              // Prepare CSS output for Tailwind
              if (outputCss) {
                let cssContent = '';
                for (const [key, value] of Object.entries(this.classReplacements)) {
                  cssContent += `.${value} { @apply ${key}; }\n`;
                }
                // Write or append the CSS content as needed
                fs.writeFileSync(outputCss, cssContent, { flag: 'a' }); // Append to existing CSS
              }
            }
          }

          callback();
        }
      );
    });
  }
}

export default ASTObfuscateClassnamesPlugin;