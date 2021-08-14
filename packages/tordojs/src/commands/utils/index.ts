import { FaunaIndex, FaunaIndexTermValue, IndexOptions } from '../../types'

export const compareIndex = (cloudIndex: FaunaIndex, localIndex: IndexOptions) => {
  const equals = (a: any, b: any) => a.length === b.length && a.every((v: any, i: any) => v === b[i])

  const cloudTermsField = new Array<string>()
  const cloudValuesField = new Array<string>()

  if (cloudIndex.terms) {
    for (const term of cloudIndex.terms) {
      for (const fieldValue of term.field) {
        if (fieldValue !== 'data') {
          cloudTermsField.push(fieldValue)
        }
      }
    }
  }

  if (cloudIndex.values) {
    for (const value of cloudIndex.values) {
      for (const fieldValue of value.field) {
        if (fieldValue !== 'data' && fieldValue !== 'ref') {
          cloudValuesField.push(fieldValue)
        }
      }
    }
  }

  return (
    cloudIndex.unique === localIndex.isUnique &&
    equals(cloudTermsField, localIndex.terms) &&
    equals(cloudValuesField, localIndex.values)
  )
}

export const compareIndexFields = (
  cloudIndexTerms: Array<FaunaIndexTermValue>,
  localIndexTerms: Array<FaunaIndexTermValue>
) => {
  const equals = (a: any, b: any) => a.length === b.length && a.every((v: any, i: any) => v === b[i])

  const localTermValuesNames: string[] = []
  for (const termsValueFields of localIndexTerms) {
    for (const field of termsValueFields.field) {
      localTermValuesNames.push(field)
    }
  }

  const cloudTermValuesNames: string[] = []
  for (const termsValueFields of cloudIndexTerms) {
    for (const field of termsValueFields.field) {
      cloudTermValuesNames.push(field)
    }
  }
  return equals(localTermValuesNames, cloudTermValuesNames)
}
