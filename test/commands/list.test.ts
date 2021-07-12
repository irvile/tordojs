import * as db from '../../src'
import ListCommand from '../../src/commands/list'

describe('List Command Test', () => {
  const emptyResult = [
    'Loading collections...',
    'Collections: Empty',
    'Loading Indexes...',
    'Indexes: Empty',
  ]

  beforeAll(async () => {
    await db.createTestDatabase('list-command-spec')
  })

  it('should show empty', async () => {
    const listCommand = new ListCommand()
    await listCommand.run()

    let logs = listCommand.logger.rows
    expect(logs).toHaveLength(4)
    expect(logs).toEqual(emptyResult)
  })

  it('should list collections and indexes', async () => {
    const listCommand = new ListCommand()

    await db.createCollection('Users')
    await db.createIndex('Users', 'Users_index_find_user')

    await listCommand.run()
    const logs = listCommand.logger.rows
    expect(logs.join()).toContain('Users')
    expect(logs.join()).toContain('Users_index_find_user')
  })
})
