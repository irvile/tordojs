import { FaunaDocument } from '../types'

export function formatter(faunaResult: FaunaDocument): any {
  if (faunaResult instanceof Array) {
    return faunaResult.map(documentRef => formatterRef(documentRef))
  }

  return formatterRef(faunaResult)
}

function formatterRef(document: FaunaDocument) {
  const data = {}

  Object.entries(document.data).map(entry => {
    const key = entry[0]
    const value = entry[1]
    if (value.ref) {
      data[key] = formatterRef(value)
    } else if (value instanceof Array && value.length > 0 && value[0].ref) {
      data[key] = value.map(documentRef => formatterRef(documentRef))
    } else if (value instanceof Array && (value.length === 0 || !value[0].ref)) {
      data[key] = value
    } else if (value instanceof String) {
      data[key] = value
    } else if (value.collection !== undefined) {
      data[key] = value
    } else if (value instanceof Object) {
      const newValueObj = {}
      // TODO: fetch ref
      if (value.value) {
        // console.log('pass')
      } else {
        Object.entries(value).forEach(([keyObj, valueObj]) => {
          if (valueObj instanceof Array && valueObj[0].ref) {
            newValueObj[keyObj] = valueObj.map(documentRef => formatterRef(documentRef))
          } else {
            newValueObj[keyObj] = valueObj
          }
        })
      }

      data[key] = newValueObj
    } else {
      data[key] = value
    }
    return entry
  })

  return Object.assign({ id: document.ref.id, ref: document.ref }, data)
}
