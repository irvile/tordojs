import faunadb, { Client } from 'faunadb'

export class FaunaManager {
  faunaClient: Client

  get() {
    if (this.faunaClient === undefined) {
      this.faunaClient = this.create()
    }

    return this.faunaClient
  }

  create(faunaSecret?: string) {
    const secret = faunaSecret || process.env.FAUNADB_KEY

    const config: any = {
      secret: secret,
      scheme: 'http',
      domain: 'localhost',
      port: 8443,
    }

    this.faunaClient = new faunadb.Client(config)
    return this.faunaClient
  }
}
