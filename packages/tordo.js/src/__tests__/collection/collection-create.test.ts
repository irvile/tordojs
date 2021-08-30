import * as database from '../..'
import { BaseCollection, field } from '../..'
import { DateTime } from 'luxon'

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

  class Timeline extends BaseCollection {
    @field({ isDate: true })
    date: Date
  }

  beforeAll(async () => {
    await database.createTestDatabase('collection-create-spec')
    await User.up()
    await Account.up()
    await Timeline.up()
  })

  beforeEach(async () => {
    await database.deleteAllDocuments()
  })

  it('should create a document', async () => {
    const userData = { name: 'fake name' }
    await User.create(userData)

    const data = await User.findMany()
    expect(data).toHaveLength(1)
    expect(data[0].name).toBe(userData.name)
  })

  it('should create a document with ref field', async () => {
    const account = await Account.create({ code: 'account code' })
    const userData = { name: 'fake name', accountRef: account.ref }
    await User.create(userData)

    const data = await User.findMany()
    expect(data).toHaveLength(1)
    expect(data[0].name).toBe(userData.name)

    const findByReferenceData = await User.find({ accountRef: account.ref })
    expect(findByReferenceData.data[0].data.name).toBe(userData.name)
  })

  it('should create a document with date field', async () => {
    await Timeline.create({
      date: DateTime.fromObject({
        year: 2021,
        month: 6,
        day: 16,
        hour: 10,
        minute: 0,
      }).toJSDate(),
    })

    const timeline = await Timeline.find({
      date: DateTime.fromObject({
        year: 2021,
        month: 6,
        day: 16,
        hour: 10,
        minute: 0,
      }).toJSDate(),
    })

    expect(timeline).toBeTruthy()
    expect(timeline.data).toHaveLength(1)
  })
})
