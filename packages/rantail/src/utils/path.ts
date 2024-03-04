const path = require("path");
const minimist = require("minimist");

/**
 * Return absolute path from path segments
 * @param pathSegment
 * @returns
 */

export const getPath = (...pathSegment: string[]): string => {
  return path.resolve(process.cwd(), ...pathSegment);
};

export const getConfigFilePath = async () => {
  // Extract args from command
  const args = minimist(process.argv.slice(2));

  // Config file path
  const configPath = getPath(args.config || "rantail.config.cjs");

  // Check file stat
  return configPath;
};
