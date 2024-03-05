export class Logger {
  /**
   * Generic error logger
   * @param text
   * @returns
   */
  static error(...text: string[]) {
    return console.error(`\x1b[31m`, `❌`, `[next-sitemap]`, ...text);
  }

  /**
   * Generic log
   * @param emoji
   * @param text
   */
  static log(emoji: string, ...text: string[]): any {
    return console.log(emoji, `[next-sitemap]`, ...text);
  }

  static generationCompleted() {
    // Initial stats
    Logger.log(`✅`, 'Generation completed')
  }

}
