import { createTestDatabase, deleteAllDocuments, field, BaseCollection } from '../../'

describe('Collection Delete Test', () => {
  class Account extends BaseCollection {
    @field()
    code: string
  }

  class User extends BaseCollection {
    @field()
    name: string

    @field()
    accountRef: any
  }

  beforeAll(async () => {
    await createTestDatabase('collection-delete-spec')
    await User.up()
    await Account.up()
  })

  beforeEach(async () => {
    await deleteAllDocuments()
  })

  it('should delete a document', async () => {
    const userData = { name: 'fake name' }
    const user = await User.create(userData)

    let data = await User.findMany()
    expect(data).toHaveLength(1)

    await User.delete(user.ref.id)

    data = await User.findMany()
    expect(data).toHaveLength(0)
  })

  it('should throw not found when the ID is incorrect', async () => {
    try {
      await User.delete('wrong')
      expect(true).toBe(false)
    } catch (error) {
      expect(error.message).toBe('User not found with ID=wrong')
    }

    const data = await User.findMany()
    expect(data).toHaveLength(0)
  })
})
