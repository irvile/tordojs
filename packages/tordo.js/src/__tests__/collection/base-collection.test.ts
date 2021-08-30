import { BaseCollection, field } from '../..'

describe('Base Collection Test', () => {
  it('should insert index using the field decorator', async () => {
    class User extends BaseCollection {
      @field()
      name: string

      @field({ isUnique: true })
      email: string
    }

    class Profile extends BaseCollection {
      @field()
      avatarUrl: string
    }

    expect(User.fields).toHaveLength(2)
    expect(User.fields[0]).toBe('name')
    expect(User.fields[1]).toBe('email')

    expect(User.getCollectionName()).toBe('User')
    expect(Object.keys(User.indexes)).toHaveLength(2)
    expect(User.indexes.name).toBeTruthy()
    expect(User.indexes.name).toBe('User_by_name')

    expect(User.indexes.email).toBeTruthy()
    expect(User.indexes.email).toBe('User_by_email')

    expect(User.uniqueFields).toHaveLength(1)
    expect(User.uniqueFields[0]).toBe('email')

    expect(Profile.getCollectionName()).toBe('Profile')
    expect(Profile.fields).toHaveLength(1)
    expect(Profile.fields[0]).toBe('avatarUrl')
    expect(Object.keys(Profile.indexes)).toHaveLength(1)
    expect(Profile.indexes.avatarUrl).toBeTruthy()
  })
})
