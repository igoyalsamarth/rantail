import path from 'node:path';
const minimist = require("minimist");
import fs from 'node:fs/promises'
import { pathToFileURL } from 'url'

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
 * @param pathSegment
 * @returns
 */

export const getConfigFilePath = async() => {
  // Extract args from command
  const args = minimist(process.argv.slice(2));

  // Config file path
  const configPath = getPath(args.config || "rantail.config.cjs");

  // Check file stat
  return fs
  .stat(configPath)
  .then(() => pathToFileURL(configPath).toString())
};

/**
 * Returns path of main css file  (to be integrated with config file)
 * @param pathSegment
 * @returns
 */

export const getCSSFilePath = async() => {
    // Config file path
    const configPath = getPath("index.css");
  
    // Check file stat
    return fs
    .stat(configPath)
    .then(() => pathToFileURL(configPath).toString())
  };