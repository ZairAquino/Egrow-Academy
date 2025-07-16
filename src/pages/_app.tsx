import type { AppProps } from 'next/app'
import { trpc } from '../../lib/trpc-client'
import '../app/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default trpc.withTRPC(MyApp) 