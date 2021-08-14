#!/usr/bin/env node
import { Command } from 'commander'
import { initAction } from './commands/init-action'
import { listAction } from './commands/list-action'
const program = new Command()

program.version('0.0.1')

program
  .command('init')
  .description('Create files required to use CLI')
  .action((env, options) => {
    initAction(env, options)
  })

program
  .command('list', { isDefault: true })
  .alias('ls')
  .description('List collections and indexes in your database')
  .action(() => {
    listAction()
  })
program.parse(process.argv)
