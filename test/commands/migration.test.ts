import * as db from '../../src'
import { BaseCollection, field, listIndexes, TordoCLI } from '../../src'
import MigrateCommand from '../../src/commands/migrate'

describe('Migration Command Test', () => {
  beforeAll(async () => {
    await db.createTestDatabase('migration-command-spec')
  })

  beforeEach(async () => {
    await db.deleteCollection('User')
  })

  it('should show nothing to migrate', async () => {
    const migrateCommand = new MigrateCommand()
    await migrateCommand.run([])

    let logs = migrateCommand.logger.rows
    expect(logs).toHaveLength(2)
    expect(logs[0]).toEqual('No collection to migrate.')
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
    let logs = migrateCommand.logger.rows
    expect(logs).toHaveLength(3)
    expect(logs).toContain('Created User')
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
    expect(logs).toContain('Created UserV2')
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
    expect(logs).toContain('No collection to migrate.')
    expect(logs).toContain('Created Index UserV2_by_email')
    expect(logs).toContain('Updated Index UserV2_all')

    const indexes = await listIndexes()
    expect(indexes).toHaveLength(3)

    await migrateCommand.run([UserV2])
    logs = migrateCommand.logger.rows
    expect(logs).toContain('No collection to migrate.')
    expect(logs).toContain('No index to migrate.')
  }, 70000)
})