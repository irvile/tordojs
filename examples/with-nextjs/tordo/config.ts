import { TordoCLI } from 'tordojs'
import { User } from '../collections/User'

const tordoCLI = new TordoCLI()
tordoCLI.add(User)

tordoCLI.runCommand(process.argv)
