import { overwriteMerge } from "./merge";
import { IConfig } from "../interface";

export const defaultConfig: Partial<IConfig> = {
    content: [
        './pages/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
        './app/**/*.{js,jsx,ts,tsx}',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    cuidLength: 12
}

export const withDefaultConfig = (config: Partial<IConfig>): IConfig => {
    return overwriteMerge(defaultConfig, config)
}
