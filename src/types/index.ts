export type ObjectProperties<Type> = {
  [Property in keyof Type]: Type[Property]
}

export type ObjectPropertiesOptional<Type> = {
  [Property in keyof Type]?: Type[Property]
}

export type ObjectType<T> = { new (): T } | Function

export type IndexOptions = {
  isUnique: boolean
  terms: string[]
  values: string[]
}

/**
 * Shape of the collection static properties
 */
export interface TordoCollectionStatic {
  /**
   * Database collection name
   */
  collection: string

  /**
   * Fields to record a document
   */
  fields: string[]

  /**
   * field with constraint unique
   */
  uniqueFields: string[]

  getCollectionName(): string

  getIndexes(): any

  getIndexesMap(): Map<string, IndexOptions>

  createCollection()

  createIndex(indexName: string, indexOptions: IndexOptions)

  /**
   * Create collection and indexes
   */
  up()

  down()
}

export interface FaunaCollection {
  id: string
}

export interface FaunaCollectionData {
  data: Array<FaunaCollection>
}

export interface FaunaIndexTermValue {
  field: string[]
}

export interface FaunaIndex {
  ref: any
  active: boolean
  serialized: boolean
  name: string
  source: FaunaCollection
  unique: boolean
  terms?: Array<FaunaIndexTermValue>
  values?: Array<FaunaIndexTermValue>
  partitions: number
}

export interface FaunaIndexData {
  data: Array<FaunaIndex>
}
