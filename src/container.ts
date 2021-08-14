export type ContainedType<T> = { new (...args: any[]): T } | Function

export interface ContainerInterface {
  get<T>(someClass: ContainedType<T>): T
}

/**
 * Container to be used by tordo for inversion control. If container was not implicitly set then by default
 * container simply creates a new instance of the given class.
 */
const defaultContainer: ContainerInterface = new (class
  implements ContainerInterface {
  private instances: { type: Function; object: any }[] = []

  get<T>(someClass: ContainedType<T>): T {
    let instance = this.instances.find(i => i.type === someClass)
    if (!instance) {
      instance = { type: someClass, object: new (someClass as new () => T)() }
      this.instances.push(instance)
    }

    return instance.object
  }
})()

let userContainer: ContainerInterface

/**
 * Sets container to be used by tordo.
 */
export function useContainer(iocContainer: ContainerInterface) {
  userContainer = iocContainer
}

/**
 * Gets the IOC container used by tordo.
 */
export function getFromContainer<T>(someClass: ContainedType<T>): T {
  if (userContainer) {
    try {
      const instance = userContainer.get(someClass)
      if (instance) return instance
    } catch (error) {
      throw error
    }
  }
  return defaultContainer.get<T>(someClass)
}
