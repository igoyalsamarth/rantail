import { TailwindClasses } from "./interface";
import { Logger } from "./logger";
import { ConfigParser } from "./parsers/config-parser";
import { getCSSFilePath } from "./utils/path";
import fs from 'node:fs'
import * as fg from 'fast-glob'
import { generateCUID } from "./utils/cuid";



export class CLI {

  async main() {

    const configParser = new ConfigParser()
    const { config } = await configParser.loadConfig()

    console.log(config)

    let cssFilePath = await getCSSFilePath();

    let cssContent: string = '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n';

    fs.writeFileSync(cssFilePath, cssContent);

    const classNameRegex: RegExp = /className=(['"])(.*?)\1|className={`([^`]*?)`}/g;

    let match: RegExpExecArray | null;
    let replacements: TailwindClasses = {};

    for (const pattern of config.content) {
      // Use fast-glob to match the file pattern
      const files: string[] = fg.globSync(pattern);
      // Loop through each matched file
      for (const file of files) {
        // Read the JSX file
        Logger.logFile(file);
        let jsxFileContent: string = fs.readFileSync(file, 'utf8');

        while ((match = classNameRegex.exec(jsxFileContent)) !== null) {
          const originalClassNames = (match[2] || match[3]).replace(/`|'|"|{|}/g, '').split(' ');
          for (const originalClassName of originalClassNames) {
            if (!/^[a-z0-9-:\\[\]\\]+$/.test(originalClassName) || originalClassName.length < 3) {
              continue;
            }
            if (!replacements[originalClassName]) {
              const randomClassName: string = generateCUID();
              replacements[originalClassName] = randomClassName;

              // Add the styles to the CSS file
              let cssContent: string = `.${randomClassName} { @apply ${originalClassName}; }\n`;
              fs.appendFileSync(cssFilePath, cssContent);
            }
          }
        }

        // Replace the class names in the JSX file
        for (let key in replacements) {
          let value = replacements[key];
          // Escape special characters in the key
          let escapedKey = key.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
          let regex = new RegExp(escapedKey, 'g');
          jsxFileContent = jsxFileContent.replace(regex, value);
        }

        // Write the modified JSX file
        fs.writeFileSync(file, jsxFileContent);
      }
    }
  }

  /**
   * Execute and log result
   * @returns
   */

  async execute() {
    return this.main().then(Logger.generationCompleted).catch(Logger.error)
  }

}