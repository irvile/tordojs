import { FaunaIndex, FaunaIndexTermValue, IndexOptions } from '../../types'

const equals = (a: any, b: any) => a.length === b.length && a.every((v: any, index: any) => v === b[index])

function getCloudTerms(cloudIndex: FaunaIndex) {
  const cloudTermsField = new Array<string>()

  if (cloudIndex.terms) {
    for (const term of cloudIndex.terms) {
      for (const fieldValue of term.field) {
        if (fieldValue !== 'data') {
          cloudTermsField.push(fieldValue)
        }
      }
    }
  }

  return cloudTermsField
}

function getCloudValues(cloudIndex: FaunaIndex) {
  const cloudValuesField = new Array<string>()

  if (cloudIndex.values) {
    for (const value of cloudIndex.values) {
      for (const fieldValue of value.field) {
        if (fieldValue !== 'data' && fieldValue !== 'ref') {
          cloudValuesField.push(fieldValue)
        }
      }
    }
  }

  return cloudValuesField
}
export const compareIndex = (cloudIndex: FaunaIndex, localIndex: IndexOptions) => {
  const cloudTermsField = getCloudTerms(cloudIndex)
  const cloudValuesField = getCloudValues(cloudIndex)

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
