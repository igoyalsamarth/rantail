const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');
const {init} = require('@paralleldrive/cuid2')

// Read the configuration file
const config = require('./rantail.config.cjs');

// Generate a random class name
const generateCUID = () => {
  const cuid = init({length:12})
  console.log(cuid())
  return cuid()
}

// Define the CSS file path
const cssFilePath = path.join(__dirname, '/src/index.css');

// Add the base Tailwind CSS directives to the CSS file
let cssContent = '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n';
fs.writeFileSync(cssFilePath, cssContent);

// Use a regular expression to match all class names in the JSX file
const classNameRegex = /className=(['"])(.*?)\1|className={`([^`]*?)`}/g;
let match;
const tailwindClasses = {};

// Loop through each content pattern in the configuration file
for (const pattern of config.content) {
  // Use fast-glob to match the file pattern
  const files = fg.globSync(pattern);

  // Loop through each matched file
  for (const file of files) {
    // Read the JSX file
    let jsxFileContent = fs.readFileSync(file, 'utf8');

    while ((match = classNameRegex.exec(jsxFileContent)) !== null) {
      const originalClassNames = (match[2] || match[3]).replace(/`/g, '').split(' ');

      let newClassNames = '';
      for (const originalClassName of originalClassNames) {
        // If the class name is not in the tailwindClasses object, generate a new random class name for it
        if (!tailwindClasses[originalClassName]) {
          const randomClassName = generateCUID();
          tailwindClasses[originalClassName] = randomClassName;

          // Add the styles to the CSS file
          cssContent = `.${randomClassName} { @apply ${originalClassName}; }\n`;
          fs.appendFileSync(cssFilePath, cssContent);
        }

        newClassNames += tailwindClasses[originalClassName] + ' ';
      }

      // Replace the class name in the JSX file
      jsxFileContent = jsxFileContent.replace(new RegExp(`(className=(['"])${match[2]}\\2|className={\`${match[3]}\`})`, 'g'), (match, p1, p2, p3) => {
        if (p2) {
          // If the match is a class name enclosed in quotes
          return `className=${p2}${newClassNames.trim()}${p2}`;
        } else {
          // If the match is a class name enclosed in backticks inside curly braces
          return `className={\`${newClassNames.trim()}\`}`;
        }
      });

      // Write the modified JSX file
      fs.writeFileSync(file, jsxFileContent);
    }
  }
}