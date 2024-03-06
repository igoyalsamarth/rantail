export interface TailwindClasses {
  [key: string]: string;
}

export interface IConfig {
  /**
   * File structure which you want to be converted
   */
  content: Array<string>;

  /**
   * main css file location from the start
   * @type {string}
   * @default undefined
   * @example 'src/index.css'
   */
  cssFilePath: string;

  /**
   * cuid css selectors length
   * @type {number}
   * @default 12
   * @example 5
   */
  cuidLength: number;

  /**
   * suffix of the css selectors
   * @type {string}
   * @default undefined
   * @example '_'
   */
  suffix?: string;

  /**
   * prefix of the css selectors
   * @type {string}
   * @default undefined
   * @example '_'
   */
  prefix?: string;

  /**
   * ignore character
   * @type {string}
   * @default undefined
   * @example '_'
   */
  ignore?: string;
}
