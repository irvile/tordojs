import faunadb, { Client } from 'faunadb'

/**
 * Fauna Manager to create instance of fauna
 *
 * Environment Variables:
 *  - TORDO_FAUNADB_LOCAL(boolean): if true will try connect using fauna docker
 *  - FAUNADB_REGION(string) : default is classic
 *  - FAUNADB_KEY(string) : your key generated in dashboard.fauna.com
 */
export class FaunaManager {
  faunaClient: Client
  config: faunadb.ClientConfig

  get() {
    if (this.faunaClient === undefined) {
      this.faunaClient = this.create()
    }

    return this.faunaClient
  }

  create(faunaSecret?: string) {
    let config: any = {
      secret: this.getFaunaSecret(faunaSecret),
      domain: this.getFaunaDomain(),
      scheme: 'https',
    }

    if (this.isTordoLocal()) {
      config = { ...config, scheme: 'http', domain: 'localhost', port: 8443 }
    }

    this.faunaClient = new faunadb.Client(config)
    this.config = config

    return this.faunaClient
  }

  private getFaunaSecret(faunaSecret?: string) {
    const secret = faunaSecret || process.env.FAUNADB_KEY
    return secret === 'undefined' ? 'secret' : secret
  }

  private getFaunaDomain() {
    const region = this.getFaunaRegion()
    if (region.toUpperCase() === 'CLASSIC') {
      return 'db.fauna.com'
    } else if (region.toUpperCase() === 'EUROPE') {
      return 'db.eu.fauna.com'
    } else if (region.toUpperCase() === 'USA') {
      return 'db.us.fauna.com'
    } else {
      return 'db.fauna.com'
    }
  }

  private getFaunaRegion() {
    const faunaRegion =
      process.env.FAUNADB_REGION === 'undefined' || process.env.FAUNADB_REGION === undefined
        ? 'classic'
        : process.env.FAUNADB_REGION!
    return faunaRegion
  }

  private isTordoLocal() {
    const isTordoLocal =
      process.env.TORDO_FAUNADB_LOCAL === 'undefined' || process.env.TORDO_FAUNADB_LOCAL === undefined
        ? true
        : process.env.TORDO_FAUNADB_LOCAL === 'true'

    return isTordoLocal
  }
}
