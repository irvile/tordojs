import path from 'path'
import { tsImport } from 'ts-import'
import dotenv from 'dotenv'

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.testing' : '.env',
})

export async function listAction() {
  process.argv.push('list')
  const tordoSetupPath = path.resolve(process.cwd(), 'tordo/setup.ts')
  const obj = await tsImport.compile(tordoSetupPath)
  await obj.default.runCommand(process.argv)
}
