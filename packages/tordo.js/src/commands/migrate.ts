import { TordoCollectionStatic, FaunaIndex } from '../types'
import { deleteIndex, deleteCollection, listIndexes, listCollections } from '../core'
import { compareIndex } from './utils'
import Logger from './utils/logger'

export default class MigrateCommand {
  static description = 'Migrate collections and indexes defined in your tordo config file'
  logger: Logger = new Logger()

  sleep(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async waitingDatabaseCacheAndCreate(tordoObject: TordoCollectionStatic, indexName: string, indexOptions: any) {
    let waitingClearCache = true

    while (waitingClearCache) {
      try {
        await this.sleep(5000)
        await tordoObject.createIndex(indexName, indexOptions)
        waitingClearCache = false
      } catch (error) {
        if (error.description !== 'document data is not valid.') {
          waitingClearCache = false
        }
      }
    }
  }

  async deleteOldIndexes(localCollections: TordoCollectionStatic[]) {
    let hasDeleteOperation = false
    const cloudIndexes = await listIndexes()

    const localIndexes = new Array<string>()
    for (const TordoObject of localCollections) {
      for (const tordoIndexName of TordoObject.getIndexesMap().keys()) {
        localIndexes.push(tordoIndexName)
      }
    }

    for (const cloudIndex of cloudIndexes) {
      const localIndex = localIndexes.find((localIndexName) => localIndexName === cloudIndex.name)
      if (localIndex === undefined) {
        await deleteIndex(cloudIndex.name)
        this.logger.success('Deleted Index ' + cloudIndex.name)
        hasDeleteOperation = true
      }
    }

    return hasDeleteOperation
  }

  async migrateCollections(localCollections: TordoCollectionStatic[], cloudCollections: string[]) {
    let hasMigrationToChange = false
    for (const TordoObject of localCollections) {
      if (!cloudCollections.includes(TordoObject.getCollectionName())) {
        await TordoObject.createCollection()
        this.logger.success('Created Collection ' + TordoObject.getCollectionName())
        hasMigrationToChange = true
      }
    }

    for (const cloudCollection of cloudCollections) {
      const TordoObject = localCollections.find((collection) => collection.getCollectionName() === cloudCollection)
      if (TordoObject === undefined) {
        await deleteCollection(cloudCollection)
        this.logger.success('Removed ' + cloudCollection)
        hasMigrationToChange = true
      }
    }

    if (!hasMigrationToChange) {
      this.logger.success('No collection to migrate.')
    }
  }

  async migrateIndexes(localCollections: TordoCollectionStatic[], cloudIndexes: FaunaIndex[]) {
    let hasMigrationOperation = false

    const recreateIndex = new Map<any, any>()

    for (const TordoObject of localCollections) {
      const tordoxIndexMap = TordoObject.getIndexesMap()

      for (const [indexName, indexOptions] of tordoxIndexMap.entries()) {
        const cloudIndex = cloudIndexes.find((cloudIndex) => cloudIndex.name === indexName)
        if (cloudIndex === undefined) {
          await TordoObject.createIndex(indexName, indexOptions)
          this.logger.success('Created Index ' + indexName)
          hasMigrationOperation = true
        }
        if (cloudIndex !== undefined && !compareIndex(cloudIndex, indexOptions)) {
          await deleteIndex(cloudIndex.name)
          recreateIndex.set(indexName, [TordoObject, indexOptions])
          hasMigrationOperation = true
        }
      }
    }

    for (const [indexName, options] of recreateIndex.entries()) {
      const tordoObject = options[0]
      const indexOptions = options[1]
      this.logger.loading('Updating index ' + indexName)
      await this.waitingDatabaseCacheAndCreate(tordoObject, indexName, indexOptions)
      this.logger.success('Updated Index ' + indexName)
      hasMigrationOperation = true
    }

    const hasDeleteOperation = await this.deleteOldIndexes(localCollections)

    if (!hasMigrationOperation && !hasDeleteOperation) {
      this.logger.success('No index to migrate.')
    }
  }

  async run(collections: TordoCollectionStatic[]) {
    this.logger.clear()
    const cloudCollections = await listCollections()
    const cloudIndexes = await listIndexes()

    try {
      await this.migrateCollections(collections, cloudCollections)
      await this.migrateIndexes(collections, cloudIndexes)
    } catch (error) {
      console.log(error)
      this.logger.warn('Ooops, something went wrong!')
    }
  }
}
