import { LoadingContextProvider } from '@/contexts/LoadingContext'
import type { AppProps } from 'next/app'
import Router from 'next/router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { RecoilRoot } from 'recoil'
import '../styles/app.less'
import '../styles/globals.css'
import '../styles/nprogress.css'

Router.events.on('routeChangeStart', nProgress.start)
Router.events.on('routeChangeError', nProgress.done)
Router.events.on('routeChangeComplete', nProgress.done)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <LoadingContextProvider>
        <Component {...pageProps} />
      </LoadingContextProvider>
    </RecoilRoot>
  )
}
export default MyApp
