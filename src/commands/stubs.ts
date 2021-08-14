export const setupStub = `
  import { TordoCLI } from 'tordojs'

  const tordoCLI = new TordoCLI()

  /**
   * add all your collections here
   *
   * tordoCLI.add(YOUR_COLLECTIION)
   *
   *  */

  tordoCLI.runCommand(process.argv)
  `
