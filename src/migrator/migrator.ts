import { TordoCollectionStatic } from '../types'

export class Migrator {
  collections: TordoCollectionStatic[] = []

  add(newCollectionClass: TordoCollectionStatic) {
    this.collections.push(newCollectionClass)

    return this
  }

  async run() {
    const promises = this.collections.map(Collection => {
      return Collection.up()
    })

    await Promise.all(promises)
  }
}
