import { BaseCollection, field, TordoCLI } from '../src'

class User extends BaseCollection {
  @field()
  name: string

  @field({ isUnique: true })
  email: string
}

const tordoCLI = new TordoCLI()
tordoCLI.add(User)

tordoCLI.runCommand(process.argv)
