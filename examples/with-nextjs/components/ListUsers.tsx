import { useQuery } from 'react-query'
import Image from 'next/image'

export default function ListUsers() {
  const usersQuery = useQuery(['users'], async () => {
    const response = await fetch('api/users')
    return response.json()
  })

  return (
    <div className="p-10 bg-gray-50">
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {usersQuery.data?.map((user) => (
          <li
            key={user.name}
            className="flex flex-col col-span-1 text-center bg-white divide-y divide-gray-200 rounded-lg shadow"
          >
            <div className="flex flex-col flex-1 p-8">
              <div className="flex-shrink-0 w-32 h-32 mx-auto rounded-full">
                <Image
                  src={user.pictureUrl}
                  className="rounded-full"
                  height={128}
                  width={128}
                ></Image>
              </div>
              <h3 className="mt-6 text-sm font-medium text-gray-900">
                {user.name}
              </h3>
              <dl className="flex flex-col justify-between flex-grow mt-1">
                <dt className="sr-only">Title</dt>
                <dd className="text-sm text-gray-500">{user.country}</dd>
              </dl>
            </div>
            <div></div>
          </li>
        ))}
      </ul>
    </div>
  )
}
