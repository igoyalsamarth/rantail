const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Read the configuration file
const config = require('./rantail.config.js');

// Generate a random class name
const generateRandomString = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Define the CSS file path
const cssFilePath = path.join(__dirname, '/src/index.css');

// Add the base Tailwind CSS directives to the CSS file
let cssContent = '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n';
fs.writeFileSync(cssFilePath, cssContent);

// Use a regular expression to match all class names in the JSX file
const classNameRegex = /className=(['"])(.*?)\1/g;
let match;
const tailwindClasses = {};

// Loop through each content pattern in the configuration file
for (const pattern of config.content) {
  // Use glob to match the file pattern
  glob(pattern, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    // Loop through each matched file
    for (const file of files) {
      // Read the JSX file
      let jsxFileContent = fs.readFileSync(file, 'utf8');

      while ((match = classNameRegex.exec(jsxFileContent)) !== null) {
        const originalClassNames = match[2].split(' ');

        let newClassNames = '';
        for (const originalClassName of originalClassNames) {
          // If the class name is not in the tailwindClasses object, generate a new random class name for it
          if (!tailwindClasses[originalClassName]) {
            const randomClassName = generateRandomString();
            tailwindClasses[originalClassName] = randomClassName;

            // Add the styles to the CSS file
            cssContent = `.${randomClassName} { @apply ${originalClassName}; }\n`;
            fs.appendFileSync(cssFilePath, cssContent);
          }

          newClassNames += tailwindClasses[originalClassName] + ' ';
        }

        // Replace the class name in the JSX file
        jsxFileContent = jsxFileContent.replace(new RegExp(`className=(['"])${match[2]}\\1`, 'g'), `className=$1${newClassNames.trim()}$1`);
      }

      // Write the modified JSX file
      fs.writeFileSync(file, jsxFileContent);
    }
  });
}