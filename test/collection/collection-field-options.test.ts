import * as db from '../../src'
import { BaseCollection, field } from '../../src'

describe('Collection Field Options Test', () => {
  class Foo extends BaseCollection {
    @field({ isUnique: true })
    bar: string
  }
  const documentData = { bar: 'fake' }

  beforeAll(async () => {
    await db.createTestConnection('collection-find-options-spec')
    await Foo.up()
  })

  it('should throw error when trying create document when has unique field', async () => {
    await Foo.create(documentData)

    try {
      await Foo.create(documentData)
      throw new Error('not expected')
    } catch (error) {
      expect(error.message).not.toEqual('not expected')
    }
  })
})
