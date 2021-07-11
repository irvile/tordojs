import { BaseCollection, field } from '../src'
import { TordoCLI } from '../src'

class HelloMigrator extends BaseCollection {
  @field()
  public message: string
}

const tordoCLI = new TordoCLI()
tordoCLI.add(HelloMigrator)

tordoCLI.runCommand(process.argv)
