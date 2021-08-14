import { listCollections, listIndexes } from '../core'
import Logger from './utils/logger'

export default class ListCommand {
  static description = 'List collections and indexes'

  logger: Logger = new Logger()

  async run() {
    this.logger.loading('Loading collections...')
    const cloudCollections = await listCollections()

    if (cloudCollections.length === 0) {
      this.logger.success('Collections: Empty')
    } else {
      this.logger.success('Collections:\n' + cloudCollections.map(c => '   ' + c).join('\n'))
    }

    this.logger.loading('Loading Indexes...')
    const cloudIndexes = await listIndexes()

    if (cloudIndexes.length === 0) {
      this.logger.success('Indexes: Empty')
    } else {
      this.logger.success('Indexes:\n' + cloudIndexes.map(i => '   ' + i.name).join('\n'))
    }
  }
}
