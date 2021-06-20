import * as db from '../../src'
import { BaseCollection, field } from '../../src'

describe('Collection Find Test', () => {
  class User extends BaseCollection {
    @field()
    name: string

    @field()
    email: string
  }

  const userData = { name: 'fake name', email: 'user@email.com' }

  beforeAll(async () => {
    await db.createTestDatabase('collection-find-spec')
    await User.up()
    await User.create(userData)
  })

  it('should find a User by field', async () => {
    let users = await User.find({ name: 'fake name' })
    expect(users.data).toHaveLength(1)
    expect(users.data[0].data.name).toBe(userData.name)
    expect(users.data[0].data.email).toBe(userData.email)

    users = await User.find({ email: 'user@email.com' })
    expect(users.data).toHaveLength(1)
    expect(users.data[0].data.name).toBe(userData.name)
    expect(users.data[0].data.email).toBe(userData.email)

    users = await User.find({ name: 'hello', email: 'user@email.com' })
    expect(users.data).toHaveLength(1)
    expect(users.data[0].data.name).toBe(userData.name)
    expect(users.data[0].data.email).toBe(userData.email)

    users = await User.find({})
    expect(users.data).toHaveLength(0)
  })
})
