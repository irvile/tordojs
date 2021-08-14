<p align="center">
  <a href="https://tordojs.com">
    <img src="./media/tordojs.png" >
  </a>
  <p align="center">Let's build amazing things more quickly and with less code.</p>
</p>

[![Join the community on GitHub Discussions](https://badgen.net/badge/join%20the%20discussion/on%20github/black?icon=github)](https://github.com/irvile/tordojs/discussions)

# TordoJS

We're building features to help developers to create awesome database using [Fauna](https://fauna.com/).

## Installation

#### With yarn

```sh
yarn add tordojs
```

#### With NPM

```sh
npm install tordojs
```

## Getting Started

At first, you need to create your collections

```js
import { BaseCollection, field } from 'tordojs'

export class User extends BaseCollection {
  @field()
  name: string

  @field()
  email: string
}
```

After that, we need create new file `tordo/config.ts` to put our collection and allow use commands to migrate or see the database state, for example.

```js
import { TordoCLI } from 'tordojs'
import { User } from 'collections/User'

/**
 * This is your Source of Truth.
 *
 * TordoJS require know all your collections.
 * To make any update in your database is required add first in this file.
 *
 */
const tordoCLI = new TordoCLI()

// add all your collections here
tordoCLI.add(User)

tordoCLI.runCommand(process.argv)
```

## Migration

One of the best features are allow you to use command line to manage your database.

for now, is required you use ts-node to run the commands.

```js

// some configurations you need create one tsconfig.tordo.json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "module": "commonjs"
  }
}

//change your package.json and add this command.
{
  scripts:  {
    "tordo": "TS_NODE_PROJECT='./tordo/tsconfig.tordojs.json' ts-node ./tordo/config.ts"
  }
}
```

Now we can use tordo commands

```sh
#this command create, update and delete your collections and indexes
yarn tordo migration
```

```sh
# allow you to see collections and indexes created in your database.
yarn tordo list
```

## Environment Variables

```sh
# boolean. Default is true
TORDO_FAUNADB_LOCAL=

# string. Need be CLASSIC, EUROPE or USA. Default is CLASSIC when use cloud database.
FAUNADB_REGION=

# string. Key to use your cloud database. Default is secret to allow you use fauna docker
FAUNADB_KEY=
```

## Documentation

For full documentation, visit [tordojs.com](https://tordojs.com/).

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discuss TordoJS on GitHub](https://github.com/irvile/tordojs/discussions)

## Status

- [x] Dev: We are developing the main features.
- [ ] Alpha: We are testing TordoJS with internal projects.
- [ ] Public Beta: Stable enough for most use-cases
- [ ] Public: Production-ready
