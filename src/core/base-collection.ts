import { DateTime } from 'luxon'
import { getFaunaClient } from '../core/tordo-functions'
import { q, ExprArg } from '../fauna'
import { IndexOptions, ObjectPropertiesOptional, ObjectType, TordoCollectionStatic } from '../types'
import { createCollection, createIndex, deleteCollection } from './tordo-functions'

function StaticImplements<T>() {
  return (_t: T) => {}
}

/**
 * Abstract class to define fully fledged data collections
 */
@StaticImplements<TordoCollectionStatic>()
export class BaseCollection {
  public static collection: string

  public static fields: string[]

  public static uniqueFields: string[]

  public static dateFields: string[]

  static indexes: any

  static getCollectionName() {
    return this.collection || this.name
  }

  static getIndexes() {
    return this.indexes
  }

  public static async create<T extends BaseCollection>(
    this: ObjectType<T>,
    properties: ObjectPropertiesOptional<T>
  ): Promise<any> {
    const _this = <typeof BaseCollection>this
    const faunaClient = getFaunaClient()

    if (_this.dateFields?.length > 0) {
      const newObject = { ...properties }

      Object.entries(properties).map(entry => {
        if (_this.dateFields.includes(entry[0])) {
          newObject[entry[0]] = DateTime.fromJSDate(entry[1] as Date).toISO()
        }
      })

      properties = { ...newObject }
    }

    const documentRef = await faunaClient.query(
      q.Create(q.Collection(_this.getCollectionName()), { data: properties })
    )
    return documentRef
  }

  public static async findMany() {
    const FQLStatement = q.Paginate(q.Match(q.Index(this.getCollectionName() + '_all')))

    const response: any = await this.runStatement(FQLStatement)
    const categories = response.data.map((row: any[]) => {
      const object = {}
      this.fields.map((fieldName, index) => {
        object[fieldName] = row[index]
      })
      object['ref'] = row[row.length - 1]
      return object
    })

    return categories
  }

  static getIndexesMap() {
    const indexesMap = new Map<string, IndexOptions>()

    if (this.indexes !== undefined && Object.keys(this.indexes).length > 0) {
      Object.entries(this.indexes).map(index => {
        const fieldName = index[0] as string
        const indexName = index[1] as string

        indexesMap.set(indexName, { isUnique: false, terms: [fieldName], values: [] })
        return index
      })
    }

    // create index for find all documents
    indexesMap.set(`${this.getCollectionName()}_all`, {
      isUnique: false,
      terms: [],
      values: this.fields,
    })

    // create index for contrainst unique fields
    if (this.uniqueFields?.length > 0) {
      indexesMap.set(`${this.getCollectionName()}_unique`, {
        isUnique: true,
        terms: this.uniqueFields,
        values: [],
      })
    }

    if (this.dateFields?.length > 0) {
      this.dateFields.map(dateField =>
        indexesMap.set(`${this.getCollectionName()}_byDate_${dateField}`, {
          isUnique: false,
          terms: [],
          values: [dateField],
        })
      )
    }

    return indexesMap
  }

  static async createCollection() {
    return createCollection(this.getCollectionName())
  }

  static async createIndex(indexName: string, indexOptions: IndexOptions) {
    await createIndex(
      this.getCollectionName(),
      indexName,
      indexOptions.isUnique,
      indexOptions.terms,
      indexOptions.values
    )
  }

  static async createIndexes() {
    for (var [indexName, indexOptions] of this.getIndexesMap().entries()) {
      await createIndex(
        this.getCollectionName(),
        indexName,
        indexOptions.isUnique,
        indexOptions.terms,
        indexOptions.values
      )
    }
  }

  static async up() {
    await createCollection(this.getCollectionName())

    for (var [indexName, indexOptions] of this.getIndexesMap().entries()) {
      await createIndex(
        this.getCollectionName(),
        indexName,
        indexOptions.isUnique,
        indexOptions.terms,
        indexOptions.values
      )
    }
  }

  static async down() {
    await deleteCollection(this.getCollectionName())
  }

  /**
   * Finds documents that match given conditions.
   */
  static async find<T extends BaseCollection>(
    this: ObjectType<T>,
    properties: ObjectPropertiesOptional<T>
  ): Promise<any>

  /**
   * Finds documents that match given find options or conditions.
   */
  static async find<T extends BaseCollection>(
    this: ObjectType<T>,
    properties: ObjectPropertiesOptional<T>
  ): Promise<any> {
    const indexMatches: ExprArg[] = []
    const _this = <typeof BaseCollection>this
    const indexes = _this.getIndexes()

    for (const indexField in indexes) {
      let searchValue = ''
      if (properties![indexField]) {
        searchValue = properties![indexField]
      }

      if (_this.dateFields?.length > 0 && _this.dateFields.includes(indexField)) {
        searchValue = DateTime.fromJSDate(properties![indexField]).toISO()
      }

      indexMatches.push(q.Match(q.Index(indexes[indexField]), searchValue))
    }

    try {
      const faunaClient = getFaunaClient()
      const docs = await faunaClient.query(
        q.Map(q.Paginate(q.Union(indexMatches)), q.Lambda('doc', q.Get(q.Var('doc'))))
      )
      return docs
    } catch (error) {
      console.log('error', error)
    }
  }

  public static async update<T extends BaseCollection>(
    this: ObjectType<T>,
    id: string,
    properties: ObjectPropertiesOptional<T>
  ): Promise<any> {
    const collectionName = (<typeof BaseCollection>this).getCollectionName()
    const faunaClient = getFaunaClient()

    try {
      const documentRef = await faunaClient.query(
        q.Update(q.Ref(q.Collection(collectionName), id), { data: properties })
      )
      return documentRef
    } catch (error) {
      if (error.message === 'invalid argument') {
        throw new Error(`${this.name} not found with ID=${id}`)
      }
    }
  }

  public static async delete(id: string) {
    const faunaClient = getFaunaClient()
    try {
      await faunaClient.query(q.Delete(q.Ref(q.Collection(this.getCollectionName()), id)))
    } catch (error) {
      if (error.message === 'invalid argument') {
        throw new Error(`${this.name} not found with ID=${id}`)
      }
    }
  }

  public static async findBetweenDate(columnDate: string, start: string, end: string) {
    try {
      const faunaClient = getFaunaClient()
      const docs: any = await faunaClient.query(
        q.Map(
          q.Paginate(
            q.Range(
              q.Match(q.Index(`${this.getCollectionName()}_byDate_${columnDate}`)),
              start,
              end
            )
          ),
          q.Lambda([columnDate, 'ref'], q.Get(q.Var('ref')))
        )
      )
      return docs
    } catch (e) {
      console.log(e)
    }
    return null
  }

  public static $addField(fieldName: string, options) {
    const collection = this.getCollectionName()
    const isUnique = options.isUnique
    const isDate = options.isDate

    if (this.fields === undefined) {
      this.fields = []
    }

    if (this.indexes === undefined) {
      this.indexes = {}
    }

    if (this.uniqueFields === undefined) {
      this.uniqueFields = []
    }

    if (this.dateFields === undefined) {
      this.dateFields = []
    }

    this.fields.push(fieldName)

    if (isUnique) {
      this.uniqueFields.push(fieldName)
    }

    if (isDate) {
      this.dateFields.push(fieldName)
    }

    this.indexes[fieldName] = `${collection}_by_${fieldName}`
  }

  static async runStatement(statement) {
    const faunaClient = getFaunaClient()
    return await faunaClient.query(statement)
  }
}
