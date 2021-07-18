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

  if (method === 'POST') {
    const { country } = req.body

    const user = await createUser(country)

    res.json(user)
  } else if (method === 'GET') {
    const users = await User.findMany()

    users.sort((a, b) => {
      return b.ref.id - a.ref.id
    })

    res.json(users)
  } else {
    res.setHeader('Allow', ['GET', 'PUT'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default handler
