import path from 'path'
import fs from 'fs'
import { setupStub } from './stubs'

export function initAction(env: any, options: any) {
  console.log('env', env)
  console.log('options', options === true)

  const tordoFolderPath = path.resolve(process.cwd(), 'tordo/')
  if (!fs.existsSync(tordoFolderPath)) {
    fs.promises.mkdir(tordoFolderPath)
  }

  if (!fs.existsSync(tordoFolderPath + '/setup.ts')) {
    fs.promises.writeFile(tordoFolderPath + '/setup.ts', setupStub)
  }
}
