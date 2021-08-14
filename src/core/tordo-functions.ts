import { FaunaManager } from '../fauna/fauna-manager'
import { getFromContainer } from '../container'
import { q, ExprVal, faunadb } from '../fauna'
import { FaunaCollectionData, FaunaIndex, FaunaIndexData } from '../types'

const {
  Do,
  If,
  Index,
  Collection,
  Exists,
  Database,
  Delete,
  Paginate,
  Lambda,
  Get,
  Var,
  Indexes,
  Collections,
  CreateDatabase,
  CreateCollection,
  CreateKey,
} = q

export function getFaunaManager(): FaunaManager {
  return getFromContainer(FaunaManager)
}

export function getFaunaClient() {
  return getFaunaManager().get()
}

export function createFaunaClient(optionsOrName?: any) {
  return getFaunaManager().create(optionsOrName)
}

export async function createTestDatabase(specName: string): Promise<any> {
  const faunaClient = getFaunaManager().create('secret')

  const database: any = await faunaClient.query(
    Do(
      If(Exists(Database(specName)), Delete(Database(specName)), false),
      CreateDatabase({ name: specName })
    )
  )

  const adminKey: any = await faunaClient.query(
    CreateKey({ database: database.ref, role: 'admin' })
  )

  createFaunaClient(adminKey.secret)
  return adminKey.secret
}

export async function deleteAllDocuments() {
  const faunaClient = getFaunaClient()
  const collections: any = await faunaClient.query(q.Paginate(q.Collections()))

  const promises = collections.data.map(collectionRef => {
    const deleteAllDocumentsFQL = If(
      Exists(q.Collection(collectionRef.id)),
      q.Map(
        q.Paginate(q.Documents(q.Collection(collectionRef.id))),
        q.Lambda('ref', Delete(q.Var('ref')))
      ),
      true
    )

    return faunaClient.query(deleteAllDocumentsFQL)
  })

  await Promise.all(promises)
}

export async function clearDatabase() {
  const faunaClient = getFaunaClient()

  await faunaClient.query(q.Map(q.Paginate(q.Collections()), q.Lambda('ref', Delete(q.Var('ref')))))
  await faunaClient.query(q.Map(q.Paginate(q.Indexes()), q.Lambda('ref', Delete(q.Var('ref')))))
}

export async function createCollection(collectionName: string) {
  const faunaClient = getFaunaClient()
  return faunaClient.query(
    If(Exists(Collection(collectionName)), true, CreateCollection({ name: collectionName }))
  )
}

export async function deleteCollection(collectionName: string) {
  const faunaClient = getFaunaClient()
  return faunaClient.query(
    If(Exists(Collection(collectionName)), Delete(Collection(collectionName)), true)
  )
}

export async function deleteIndex(indexName: string) {
  const faunaClient = getFaunaClient()
  return faunaClient.query(If(Exists(Index(indexName)), Delete(Index(indexName)), true))
}

export async function createIndex(
  collectionName: string,
  name: string,
  isUnique = false,
  terms: string[] = [],
  values: string[] = []
) {
  let indexTerms: ExprVal[] | null = null
  let indexValues: ExprVal[] | null = null

  function pushTerm(field) {
    return field === 'ref' ? { field: 'ref' } : { field: ['data', field] }
  }

  if (terms.length > 0) {
    indexTerms = []
    terms.map(field => indexTerms!.push(pushTerm(field)))
  }

  if (values.length > 0) {
    indexValues = []
    values.map(field =>
      indexValues!.push({
        field: ['data', field],
      })
    )

    indexValues.push({ field: ['ref'] })
  }

  const faunaClient = getFaunaClient()

  await faunaClient.query(
    q.CreateIndex({
      name: name,
      source: Collection(collectionName),
      serialized: true,
      unique: isUnique,
      terms: indexTerms,
      values: indexValues,
    })
  )
}

export const listIndexes = async (): Promise<FaunaIndex[]> => {
  const faunaClient = getFaunaClient()
  const indexes: FaunaIndexData = await faunaClient.query(
    faunadb.query.Map(Paginate(Indexes()), Lambda('index', Get(Var('index'))))
  )
  return indexes.data
}

export const listCollections = async (): Promise<Array<string>> => {
  const faunaClient = getFaunaClient()
  const collections: FaunaCollectionData = await faunaClient.query(Paginate(Collections()))
  return collections.data.map(collectionRef => collectionRef.id)
}
