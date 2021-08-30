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

export { field }
