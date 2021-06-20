import * as db from '../../src'
import { BaseCollection, field } from '../../src'

describe('Collection Create Test', () => {
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
    await db.createTestDatabase('collection-create-spec')
    await User.up()
    await Account.up()
  })

  beforeEach(async () => {
    await db.deleteAllDocuments()
  })

  it('should create a document', async () => {
    const userData = { name: 'fake name' }
    await User.create(userData)

    const data = await User.findMany()
    expect(data).toHaveLength(1)
    expect(data[0].name).toBe(userData.name)
  })

  it('should create a document with ref field', async () => {
    const account: any = await Account.create({ code: 'account code' })
    const userData = { name: 'fake name', accountRef: account.ref }
    await User.create(userData)

    const data = await User.findMany()
    expect(data).toHaveLength(1)
    expect(data[0].name).toBe(userData.name)

    const findByRefData = await User.find({ accountRef: account.ref })
    expect(findByRefData.data[0].data.name).toBe(userData.name)
  })
})
