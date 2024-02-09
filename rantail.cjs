const fs = require('fs');
const path = require('path');

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

// Read the JSX file
const jsxFilePath = path.join(__dirname, '/src/App.jsx');
let jsxFileContent = fs.readFileSync(jsxFilePath, 'utf8');

// Define the CSS file path
const cssFilePath = path.join(__dirname, '/src/index.css');

// Add the base Tailwind CSS directives to the CSS file
let cssContent = '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n';
fs.writeFileSync(cssFilePath, cssContent);

// Use a regular expression to match all class names in the JSX file
const classNameRegex = /className=['"]([^'"]*)['"]/g;
let match;
const tailwindClasses = {};

while ((match = classNameRegex.exec(jsxFileContent)) !== null) {
  const originalClassName = match[1];

  // If the class name is not in the tailwindClasses object, generate a new random class name for it
  if (!tailwindClasses[originalClassName]) {
    const randomClassName = generateRandomString();
    tailwindClasses[originalClassName] = randomClassName;

    // Add the styles to the CSS file
    cssContent = `.${randomClassName} { @apply ${originalClassName}; }\n`;
    fs.appendFileSync(cssFilePath, cssContent);
  }

  // Replace the class name in the JSX file
  jsxFileContent = jsxFileContent.replace(new RegExp(`className="${originalClassName}"`, 'g'), `className="${tailwindClasses[originalClassName]}"`);
}

// Write the modified JSX file
fs.writeFileSync(jsxFilePath, jsxFileContent);