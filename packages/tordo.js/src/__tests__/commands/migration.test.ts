import * as database from '../../../src'
import { BaseCollection, field, listIndexes, TordoCLI } from '../../../src'
import MigrateCommand from '../../../src/commands/migrate'

describe('Migration Command Test', () => {
  const EMPTY_COLLECTION_TEXT = 'No collection to migrate.'

  beforeAll(async () => {
    await database.createTestDatabase('migration-command-spec')
  })

  beforeEach(async () => {
    await database.deleteCollection('User')
    await database.deleteCollection('UserV2')
  })

  it('should show nothing to migrate', async () => {
    const migrateCommand = new MigrateCommand()
    await migrateCommand.run([])

    const logs = migrateCommand.logger.rows
    expect(logs).toHaveLength(2)
    expect(logs[0]).toEqual(EMPTY_COLLECTION_TEXT)
    expect(logs[1]).toEqual('No index to migrate.')
  })

  it('should migrate collection and indexes', async () => {
    const tordoCLI = new TordoCLI()
    class User extends BaseCollection {
      @field()
      name: string
    }

    tordoCLI.add(User)

    const migrateCommand = new MigrateCommand()

    await migrateCommand.run(tordoCLI.collections)
    const logs = migrateCommand.logger.rows
    expect(logs).toHaveLength(3)
    expect(logs).toContain('Created Collection User')
    expect(logs).toContain('Created Index User_by_name')
    expect(logs).toContain('Created Index User_all')
  })

  it('should create new index and update index_all when collection has new field', async () => {
    class User extends BaseCollection {
      static collection = 'UserV2'
      @field()
      name: string
    }

    const migrateCommand = new MigrateCommand()
    await migrateCommand.run([User])

    let logs = migrateCommand.logger.rows
    expect(logs).toHaveLength(3)
    expect(logs).toContain('Created Collection UserV2')
    expect(logs).toContain('Created Index UserV2_by_name')
    expect(logs).toContain('Created Index UserV2_all')

    class UserV2 extends BaseCollection {
      static collection = 'UserV2'
      @field()
      name: string

      @field()
      email: string
    }

    await migrateCommand.run([UserV2])
    logs = migrateCommand.logger.rows
    expect(logs).toContain(EMPTY_COLLECTION_TEXT)
    expect(logs).toContain('Created Index UserV2_by_email')
    expect(logs).toContain('Updated Index UserV2_all')

    const indexes = await listIndexes()
    expect(indexes).toHaveLength(3)

    await migrateCommand.run([UserV2])
    logs = migrateCommand.logger.rows
    expect(logs).toContain(EMPTY_COLLECTION_TEXT)
    expect(logs).toContain('No index to migrate.')
  }, 70_000)

  it('should remove index when remove field in collection model', async () => {
    class User extends BaseCollection {
      static collection = 'UserV3'
      @field()
      name: string

      @field({ isUnique: true })
      email: string

      @field()
      password: string
    }

    const migrateCommand = new MigrateCommand()
    await migrateCommand.run([User])

    let logs = migrateCommand.logger.rows
    expect(logs).toHaveLength(6)

    class UserV2 extends BaseCollection {
      static collection = 'UserV3'
      @field()
      name: string

      @field({ isUnique: true })
      email: string
    }

    await migrateCommand.run([UserV2])
    logs = migrateCommand.logger.rows
    expect(logs).toHaveLength(4)

    let indexes = await listIndexes()
    expect(indexes).toHaveLength(4)

    await migrateCommand.run([UserV2])
    indexes = await listIndexes()
    expect(indexes).toHaveLength(4)
  }, 70_000)
})
