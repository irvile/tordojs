/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
function StaticImplements<T>() {
  return (_t: T) => {}
}

type FieldDecoratorOption = {
  isUnique?: boolean
  isDate?: boolean
}
const field = (options?: FieldDecoratorOption) => {
  return function decorateAsColumn(target, property) {
    const Model = target.constructor
    Model.$addField(property, options || {})
  }
}

export { field, StaticImplements }
