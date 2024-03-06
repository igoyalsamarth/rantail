import path from 'node:path';
const minimist = require("minimist");
import fs from 'node:fs/promises'
import { pathToFileURL } from 'url'
import { Logger } from '../logger';

/**
 * Returns absolute path from path segments
 * @param pathSegment
 * @returns
 */

export const getPath = (...pathSegment: string[]): string => {
  return path.resolve(process.cwd(), ...pathSegment);
};

/**
 * Returns path of config file
 * @param
 * @returns
 */

export const getConfigFilePath = async () => {

  const args = minimist(process.argv.slice(2))
  const configPath = getPath(args.config || 'rantail.config.js')

  return fs
    .stat(configPath)
    .then(() => pathToFileURL(configPath).toString())
}

/**
 * Returns path of main css file  (to be integrated with config file)
 * @param
 * @returns
 */

export const getCSSFilePath = async (cssFilePath: string) => {
  
  if (!cssFilePath) {
    throw new Error('CSS File Path is not declared in the config File, continuing with unencoded code build.');
  }

  const fullCssFilePath = getPath(cssFilePath);

  Logger.loadingCSS(fullCssFilePath)

  // Check file stat
  return fullCssFilePath;
};