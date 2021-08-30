import { FaunaManager } from '../../fauna/fauna-manager'

describe('Fauna Manager Environment Config Test', () => {
  it('should connect local fauna when not setting any variable', async () => {
    process.env.TORDO_FAUNADB_LOCAL = undefined
    process.env.FAUNADB_KEY = undefined
    process.env.FAUNADB_REGION = undefined

    const faunaManager = new FaunaManager()

    faunaManager.create()

    expect(faunaManager.config.domain).toBe('localhost')
    expect(faunaManager.config.secret).toBe('secret')
    expect(faunaManager.config.scheme).toBe('http')
    expect(faunaManager.config.port).toBe(8443)
  })

  it('should connect cloud fauna when set tordo fauna local is false', async () => {
    process.env.TORDO_FAUNADB_LOCAL = 'false'

    const faunaManager = new FaunaManager()
    faunaManager.create('fake-key')
    expect(faunaManager.config.domain).toBe('db.fauna.com')
    expect(faunaManager.config.scheme).toBe('https')
    expect(faunaManager.config.secret).toBe('fake-key')
  })

  it('should connect using Europe region', async () => {
    process.env.TORDO_FAUNADB_LOCAL = 'false'
    process.env.FAUNADB_REGION = 'EUROPE'

    const faunaManager = new FaunaManager()
    faunaManager.create('fake-key')
    expect(faunaManager.config.domain).toBe('db.eu.fauna.com')
    expect(faunaManager.config.scheme).toBe('https')
    expect(faunaManager.config.secret).toBe('fake-key')
  })

  it('should connect using USA region', async () => {
    process.env.TORDO_FAUNADB_LOCAL = 'false'
    process.env.FAUNADB_REGION = 'usa'
    process.env.FAUNADB_KEY = 'fake-key'

    const faunaManager = new FaunaManager()
    faunaManager.create()
    expect(faunaManager.config.domain).toBe('db.us.fauna.com')
    expect(faunaManager.config.scheme).toBe('https')
    expect(faunaManager.config.secret).toBe('fake-key')
  })
})
