import { TailwindClasses } from "./interface";

const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');
const { init } = require('@paralleldrive/cuid2')

// Read the configuration file
const config = require('./rantail.config.cjs');

// Generate a random class name
const generateCUID = (): string => {
  const cuid = init({ length: 12 });
  return cuid();
}

// Define the CSS file path
const cssFilePath: string = path.join(__dirname, '/src/index.css');

// Add the base Tailwind CSS directives to the CSS file
let cssContent: string = '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n';
fs.writeFileSync(cssFilePath, cssContent);

// Use a regular expression to match all class names in the JSX file
const classNameRegex: RegExp = /className=(['"])(.*?)\1|className={`([^`]*?)`}/g;
let match: RegExpExecArray | null;
const tailwindClasses: TailwindClasses = {};
let replacements: TailwindClasses = {};

// Loop through each content pattern in the configuration file
for (const pattern of config.content) {
  // Use fast-glob to match the file pattern
  const files: string[] = fg.globSync(pattern);
  // Loop through each matched file
  for (const file of files) {
    // Read the JSX file
    console.log(`Processing file: ${file}`);
    let jsxFileContent: string = fs.readFileSync(file, 'utf8');

    while ((match = classNameRegex.exec(jsxFileContent)) !== null) {
      const originalClassNames = (match[2] || match[3]).replace(/`|'|"|{|}/g, '').split(' ');
      for (const originalClassName of originalClassNames) {
        if (!/^[a-z0-9-:\\[\]\\]+$/.test(originalClassName) || originalClassName.length < 3) {
          continue;
        }
        if (!tailwindClasses[originalClassName]) {
          const randomClassName: string = generateCUID();
          tailwindClasses[originalClassName] = randomClassName;
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