import dotenv from 'dotenv'

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.testing' : '.env',
})

import faunadb, { ExprVal, ExprArg } from 'faunadb'

const q = faunadb.query

export { faunadb, q, ExprVal, ExprArg }
