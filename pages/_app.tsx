import "../styles/globals.css"
import type { AppProps } from "next/app"
import "minireset.css"

import "water.css/out/light.css"
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
