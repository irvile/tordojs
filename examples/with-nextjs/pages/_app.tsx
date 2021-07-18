import 'tailwindcss/tailwind.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useRef } from 'react'

export default function MyApp({ Component, pageProps }) {
  const queryClientRef: any = useRef()

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient()
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
