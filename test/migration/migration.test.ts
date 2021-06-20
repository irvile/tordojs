import { BaseCollection, createTestConnection, getFaunaClient } from '../../src'
import { Migrator } from '../../src/migrator'
import { q } from '../../src/fauna'

describe('Migration Test', () => {
  beforeAll(async () => {
    await createTestConnection('migration-test')
  })

  it('should run collection up function', async () => {
    const faunaClient = getFaunaClient()

    class Foo extends BaseCollection {}

    const migrator = new Migrator()
    migrator.add(Foo)

    let collections: any = await faunaClient.query(q.Paginate(q.Collections()))

    expect(collections.data).toHaveLength(0)
    await migrator.run()

    collections = await faunaClient.query(q.Paginate(q.Collections()))
    expect(collections.data).toHaveLength(1)
    expect(collections.data[0].id).toBe('Foo')
  })
})
