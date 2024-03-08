/** @type {import('rantail').IConfig} */


module.exports ={
    suffix: '_',
    prefix: '_',
    cuidLength: 5,
    cssFilePath:'app/global.css',
    content: [
        './pages/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
        './app/**/*.{js,jsx,ts,tsx}',
        './src/**/*.{js,jsx,ts,tsx}',
    ]
}