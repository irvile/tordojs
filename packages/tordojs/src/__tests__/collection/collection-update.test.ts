import { createTestDatabase, deleteAllDocuments, field, BaseCollection } from '../../'

describe('Collection Update Test', () => {
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
    await createTestDatabase('collection-update-spec')
    await User.up()
    await Account.up()
  })

  beforeEach(async () => {
    await deleteAllDocuments()
  })

  it('should update a document', async () => {
    const userData = { name: 'fake name' }
    const userUpdateData = { name: 'Tony Stark' }
    const user = await User.create(userData)
    await User.update(user.ref.id, userUpdateData)

    const data = await User.findMany()
    expect(data).toHaveLength(1)
    expect(data[0].name).toBe(userUpdateData.name)
  })

  it('should throw not found when the ID is incorrect', async () => {
    const userData = { name: 'fake name' }
    try {
      await User.update('wrong', userData)
      expect(true).toBe(false)
    } catch (error) {
      expect(error.message).toBe('User not found with ID=wrong')
    }

    const data = await User.findMany()
    expect(data).toHaveLength(0)
  })
})
