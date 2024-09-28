import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { generateCUID } from './utils/cuid';
import { Compiler, ResolveData } from 'webpack';
import * as fs from 'fs';
import { Source } from 'webpack-sources'; // Import Source from webpack-sources
import { countReset } from 'console';
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
    throw new Error('Method not implemented.');
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

    // Hook into normal module factory
    compiler.hooks.normalModuleFactory.tap('ASTObfuscateClassnamesPlugin', (normalModuleFactory) => {
      normalModuleFactory.hooks.beforeResolve.tapAsync(
        'ASTObfuscateClassnamesPlugin',
        (data: ResolveData, callback: () => void) => {
          const { cuidLength = 8, prefix = '', suffix = '', ignorePrefix = '', outputCss, outputJson } = this.config;

          if (data) {
            const filename = data.request; // Get the filename

            // Only process JavaScript/TypeScript files
            if (/\.(js|jsx|ts|tsx)$/.test(filename) && filename.includes('/app/')) {

              let sourceCode = fs.readFileSync(data.request, 'utf-8');
              const ast = parse(sourceCode, {
                sourceType: 'module',
                plugins: ['jsx', 'typescript'],
              });

              traverse(ast, {
                JSXAttribute: (path) => {
                  if (path.node.name.name === 'className') {
                    const valueNode = path.node.value;

                    // Ensure valueNode is defined and handle different types
                    if (valueNode) {
                      let classNames: string[] = [];

                      if (valueNode.type === 'StringLiteral') {
                        classNames = valueNode.value.split(' ');
                      } else if (valueNode.type === 'JSXExpressionContainer') {
                        if (valueNode.expression.type === 'Identifier') {
                          classNames = [valueNode.expression.name]; // Handle as needed
                        }
                      }

                      // Log the original class names

                      const obfuscatedClassNames = classNames.map((className: string) => {
                        // Log the class name before obfuscation
                        //console.log('className', className)
                        //console.log(this.classReplacements, 'object')
                        if (ignorePrefix.length > 0 && className.startsWith(ignorePrefix)) return className;

                        if (className.length === 0) return className;

                        if (!this.classReplacements[className]) {
                          this.classReplacements[className] = generateCUID(8);
                          //console.log('Obfuscating:', className, '=>', this.classReplacements[className]);
                        }
                        // Log the obfuscation result
                        return this.classReplacements[className];
                      });

                      // Log the final obfuscated class names

                      // Update the value node to a StringLiteral with the obfuscated class names
                      path.node.value = {
                        type: 'StringLiteral',
                        value: obfuscatedClassNames.join(' '),
                      } as any; // Cast to `any` to bypass strict typing
                    }
                  }
                },
              });

              const output = generate(ast, {}, sourceCode).code;

              console.log('output', output)

              // Use CustomSource instead of RawSource or OriginalSource
              const customSource = new CustomSource(output);
              sourceCode = customSource.getContent();

              // Write the modified source code back to the file
              fs.writeFileSync(data.request, sourceCode, 'utf-8');

              // Resolve the CSS file path relative to the project's root directory
              const cssFilePath = path.resolve(process.cwd(), 'app', 'global.css');
              let cssContent = '';

              for (const [key, value] of Object.entries(this.classReplacements)) {
                cssContent += `.${value} { @apply ${key}; }\n`;
              }

              // Write the CSS content to app/global.css in the project directory
              fs.writeFileSync(cssFilePath, cssContent, 'utf-8');
            }
          }

          callback(); // Call callback to indicate completion
        }
      );
    });
  }
}

export default ASTObfuscateClassnamesPlugin;