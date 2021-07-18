// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'
import { User } from '../../collections/User'

const fetcher = (url) => fetch(url).then((res) => res.json())

async function createUser(country: string) {
  const response = await fetcher(
    'https://randomuser.me/api/?inc=name,picture&noinfo'
  )
  const randomUser = response.results[0]

  const user = await User.create({
    name: `${randomUser.name.first} ${randomUser.name.last}`,
    pictureUrl: randomUser.picture.large,
    country,
  })

  return user
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { country } = req.body
        const user = await createUser(country)
        res.json(user)
      } catch (error) {
        throw new Error(
          'Ooops! Something get wrong while connecting to the database'
        )
      }
      break
    case 'GET':
      try {
        const users = await User.findMany()
        users.sort((a, b) => {
          return b.ref.id - a.ref.id
        })
        res.json(users)
      } catch (error) {
        throw new Error(
          'Ooops! Something get wrong while connecting to the database'
        )
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default handler
