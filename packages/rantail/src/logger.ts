export class Logger {

  /**
   * Generic error logger
   * @param text
   * @returns
   */
  static error(...text: string[]) {
    return console.error(`❌`, `[rantail]`, ...text);
  }

  /**
   * Generic log
   * @param emoji
   * @param text
   */
  static log(emoji: string, ...text: string[]): any {
    return console.log(emoji, `[rantail]:`, ...text);
  }

  /**
   * Generic success logger
   * @param
   * @returns
   */

  static generationCompleted() {
    Logger.log(`✅`, 'Generation completed')
  }

  /**
  * Generic file process logger
  * @param
  * @returns
  */

  static logFile(fileName: string) {
    Logger.log(`❗`, `Processing File`, fileName)
  }

  /**
  * Generic config loader logger
  * @param
  * @returns
  */

  static loadingConfig(path: string) {
    Logger.log(`✨`, `Loading Rantail config from `, path)
  }

  static loadingCSS(path:string){
    Logger.log(`✨`, `Loading main CSS file from `, path)
  }
}
