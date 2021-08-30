/* eslint-disable sonarjs/cognitive-complexity */
import { FaunaDocument } from '../types'

export function formatter(faunaResult: FaunaDocument): any {
  if (Array.isArray(faunaResult)) {
    return faunaResult.map((documentReference) => formatterReference(documentReference))
  }

  return formatterReference(faunaResult)
}

function formatterReference(document: FaunaDocument) {
  const data = {}

  Object.entries(document.data).map((entry) => {
    const key = entry[0]
    const value = entry[1]
    if (value.ref) {
      data[key] = formatterReference(value)
    } else if (Array.isArray(value) && value.length > 0 && value[0].ref) {
      data[key] = value.map((documentReference) => formatterReference(documentReference))
    } else if (Array.isArray(value) && (value.length === 0 || !value[0].ref)) {
      data[key] = value
    } else if (value instanceof String) {
      data[key] = value
    } else if (value.collection !== undefined) {
      data[key] = value
    } else if (value instanceof Object) {
      const newValueObject = {}
      // TODO: fetch ref
      if (value.value) {
        // console.log('pass')
      } else {
        for (const [keyObject, valueObject] of Object.entries(value)) {
          if (Array.isArray(valueObject) && valueObject[0].ref) {
            newValueObject[keyObject] = valueObject.map((documentReference) => formatterReference(documentReference))
          } else {
            newValueObject[keyObject] = valueObject
          }
        }
      }

      data[key] = newValueObject
    } else {
      data[key] = value
    }
    return entry
  })

  return Object.assign({ id: document.ref.id, ref: document.ref }, data)
}
