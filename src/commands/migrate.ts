import { TordoCollectionStatic, FaunaIndex } from '../types'
import { deleteIndex, deleteCollection, listIndexes, listCollections } from '../core'
import { compareIndex } from './utils'

export default class MigrateCommand {
  static description = 'Migrate collections and indexes defined in your tordo config file'

  sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms))
  }

  async waitingDatabaseCacheAndCreate(
    tordoObject: TordoCollectionStatic,
    indexName: string,
    indexOptions: any
  ) {
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

  async deleteOldIndexes(localCollections: TordoCollectionStatic[], cloudIndexes: FaunaIndex[]) {
    let localIndexes = new Array<string>()
    for (const TordoObject of localCollections) {
      localIndexes = [...localIndexes, ...TordoObject.getIndexesMap().keys()]
    }

    for (const cloudIndex of cloudIndexes) {
      const localIndex = localIndexes.find(localIndex => localIndex === cloudIndex.name)
      if (localIndex === undefined) {
        await deleteIndex(cloudIndex.name)
      }
    }
  }

  async migrateCollections(localCollections: TordoCollectionStatic[], cloudCollections: string[]) {
    for (const TordoObject of localCollections) {
      if (!cloudCollections.includes(TordoObject.getCollectionName())) {
        await TordoObject.createCollection()
      }
    }

    for (const cloudCollection of cloudCollections) {
      const TordoObject = localCollections.find(
        collection => collection.getCollectionName() === cloudCollection
      )
      if (TordoObject === undefined) {
        await deleteCollection(cloudCollection)
      }
    }
  }

  async migrateIndexes(localCollections: TordoCollectionStatic[], cloudIndexes: FaunaIndex[]) {
    const recreateIndex = new Map<any, any>()

    for (const TordoObject of localCollections) {
      const tordoxIndexMap = TordoObject.getIndexesMap()

      for (const [indexName, indexOptions] of tordoxIndexMap.entries()) {
        const cloudIndex = cloudIndexes.find(cloudIndex => cloudIndex.name === indexName)
        if (cloudIndex === undefined) {
          await TordoObject.createIndex(indexName, indexOptions)
        }
        if (cloudIndex !== undefined && !compareIndex(cloudIndex, indexOptions)) {
          await deleteIndex(cloudIndex.name)
          recreateIndex.set(indexName, [TordoObject, indexOptions])
        }
      }
    }
    for (const [indexName, options] of recreateIndex.entries()) {
      const tordoObject = options[0]
      const indexOptions = options[1]

      await this.waitingDatabaseCacheAndCreate(tordoObject, indexName, indexOptions)
    }

    await this.deleteOldIndexes(localCollections, cloudIndexes)
  }

  async run(collections: TordoCollectionStatic[]) {
    const cloudCollections = await listCollections()
    const cloudIndexes = await listIndexes()

    await this.migrateCollections(collections, cloudCollections)
    await this.migrateIndexes(collections, cloudIndexes)
  }
}
