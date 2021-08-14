import { DateTime } from 'luxon'
import * as db from '../../src'
import { BaseCollection, field } from '../../src'

describe('Collection Find Test', () => {
  class User extends BaseCollection {
    @field()
    name: string

    @field()
    email: string
  }

  class Timeline extends BaseCollection {
    @field({ isDate: true })
    date: Date
  }

  const userData = { name: 'fake name', email: 'user@email.com' }

  beforeAll(async () => {
    await db.createTestDatabase('collection-find-spec')
    await User.up()
    await Timeline.up()

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

  it('should find between dates', async () => {
    await Timeline.create({
      date: DateTime.fromObject({
        year: 2021,
        month: 6,
        day: 16,
        hour: 10,
        minute: 0,
      }).toJSDate(),
    })

    let timelinesByDates = await Timeline.findBetweenDates(
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

    timelinesByDates = await Timeline.findBetweenDates(
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
