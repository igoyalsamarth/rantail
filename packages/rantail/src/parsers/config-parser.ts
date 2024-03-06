import { IConfig } from "../interface"
import { Logger } from "../logger"
import { withDefaultConfig } from "../utils/defaults"
import { getConfigFilePath } from "../utils/path"

export class ConfigParser {
  /**
  * Load rantail.config.js as module
  * @returns
  */

  private async loadBaseConfig(): Promise<IConfig> {
    // Get config file path
    const path = await getConfigFilePath()

    // Config loading message
    Logger.loadingConfig(path)

    // Load base config
    const baseConfig = await import(path)

    if (!baseConfig?.default) {
      throw new Error('Unable to import rantail config file')
    }

    return withDefaultConfig(baseConfig.default)
  }

  async loadConfig() {
    // Load base config
    const config = await this.loadBaseConfig()

    // Return full result
    return {
      config,
    }
  }
}