import * as db from '../../src'
import { BaseCollection, field } from '../../src'
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
    await db.createTestDatabase('collection-create-spec')
    await User.up()
    await Account.up()
    await Timeline.up()
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

    let timelinesByDates = await Timeline.findBetweenDate(
      'date',
      DateTime.fromObject({
        year: 2021,
        month: 6,
        day: 16,
        hour: 0,
        minute: 0,
      }).toISO(),
      DateTime.fromObject({
        year: 2021,
        month: 6,
        day: 16,
        hour: 23,
        minute: 59,
      }).toISO()
    )
    expect(timelinesByDates).toBeTruthy()
    expect(timelinesByDates.data).toHaveLength(1)

    timelinesByDates = await Timeline.findBetweenDate(
      'date',
      DateTime.fromObject({
        year: 2020,
        month: 6,
        day: 16,
        hour: 0,
        minute: 0,
      }).toISO(),
      DateTime.fromObject({
        year: 2020,
        month: 6,
        day: 16,
        hour: 23,
        minute: 59,
      }).toISO()
    )

    expect(timelinesByDates).toBeTruthy()
    expect(timelinesByDates.data).toHaveLength(0)
  })
})
