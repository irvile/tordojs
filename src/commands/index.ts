import { TordoCollectionStatic } from '../types'
import ListCommand from './list'
import MigrateCommand from './migrate'

class TordoCLI {
  collections: TordoCollectionStatic[] = []

  add(newCollectionClass: TordoCollectionStatic) {
    this.collections.push(newCollectionClass)

    return this
  }

  async runCommand(argv: string[]) {
    if (argv.length < 3) {
      console.log('Command not found')
      return
    }
    const migrationCommand = new MigrateCommand()
    const listCommand = new ListCommand()

    const command = argv[2]

    switch (command.toUpperCase()) {
      case 'LIST':
        await listCommand.run()
        break
      case 'MIGRATION':
        await migrationCommand.run(this.collections)
        break
      default:
        console.log('Sorry, command not found =(')
    }
  }
}

export default TordoCLI
