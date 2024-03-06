export interface TailwindClasses {
  [key: string]: string;
}

export interface IConfig {
  /**
   * File structure which you want to be converted
   */
  content: Array<string>;

  /**
   * suffix of the css selectors
   */
  suffix?: string;

  /**
   * prefix of the css selectors
   */
  prefix?: string;

  /**
   * cuid css selectors length
   */
  cuidLength: number;

  /**
   * ignore character
   */
  ignore?: string;
}
