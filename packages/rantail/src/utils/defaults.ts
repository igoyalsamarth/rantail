import { overwriteMerge } from "./merge";
import { IConfig } from "../interface";

export const defaultConfig: Partial<IConfig> = {
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
    ]
}

export const withDefaultConfig = (config: Partial<IConfig>): IConfig => {
    return overwriteMerge(defaultConfig, config)
}
