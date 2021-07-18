import Link from 'next/link'
import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import SubmitButton from '../components/SubmitButton'

export default function Form() {
  const [country, setCountry] = useState('')
  const queryClient = useQueryClient()

  const createUserMutation = useMutation(async () => {
    const response = await fetch('api/users', {
      body: JSON.stringify({
        country: country,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    queryClient.invalidateQueries('users')
    setCountry('')
    return response.json()
  })

  function onKeyUp(event) {
    if (event.charCode === 13) {
      createUserMutation.mutate()
    }
  }

  return (
    <div className="flex justify-center px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-700">
          Welcome to TordoJS+NextJS
        </h1>
        <p className="text-gray-600">
          This app is deployed to vercel and connected to your Fauna database.
          The example project can be found{' '}
          <Link href="https://github.com/irvile/tordojs/examples/with-nextjs">
            <a className="text-indigo-700">here.</a>
          </Link>
        </p>
        <div className="space-y-4 ">
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Where are you from?
            </label>
            <div className="mt-1">
              <input
                id="country"
                name="country"
                type="country"
                value={country}
                onKeyPress={onKeyUp}
                onChange={(e) => setCountry(e.currentTarget.value)}
                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <SubmitButton
              loading={createUserMutation.isLoading}
              name="Create new user"
              onClick={() => createUserMutation.mutate()}
            ></SubmitButton>
          </div>
        </div>
      </div>
    </div>
  )
}
