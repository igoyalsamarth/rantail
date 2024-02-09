const fs = require('fs');
const path = require('path');

// Define the mapping from original class names to Tailwind CSS classes
const tailwindClasses = {
  'text-lg': 'text-lg',
  'text-sm': 'text-sm',
};

// Generate a random class name
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Read the JSX file
const jsxFilePath = path.join(__dirname, 'App.jsx');
let jsxFileContent = fs.readFileSync(jsxFilePath, 'utf8');

// Replace the class names in the JSX file and add the styles to the CSS file
for (const originalClassName in tailwindClasses) {
  const randomClassName = generateRandomString();
  const tailwindClass = tailwindClasses[originalClassName];

  // Replace the class name in the JSX file
  jsxFileContent = jsxFileContent.replace(new RegExp(`className="${originalClassName}"`, 'g'), `className="${randomClassName}"`);

  // Add the styles to the CSS file
  const cssFilePath = path.join(__dirname, 'index.css');
  const cssContent = `.${randomClassName} { @apply ${tailwindClass}; }\n`;
  fs.appendFileSync(cssFilePath, cssContent);
}

// Write the modified JSX file
fs.writeFileSync(jsxFilePath, jsxFileContent);