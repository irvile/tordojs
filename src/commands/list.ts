import { listCollections, listIndexes } from '../core'

export default class ListCommand {
  static description = 'List collections and indexes'

  async run() {
    const cloudCollections = await listCollections()
    const cloudIndexes = await listIndexes()

    console.log('Collections:')
    for (const collection of cloudCollections) {
      console.log(`- ${collection}`)
    }
    if (cloudCollections.length === 0) {
      console.log('Empty')
    }

    console.log('Indexes:')
    for (const index of cloudIndexes) {
      console.log(`- ${index.name}`)
    }
    if (cloudIndexes.length === 0) {
      console.log('Empty')
    }
  }
}
