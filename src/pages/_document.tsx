import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script
          src={`${process.env.NEXT_PUBLIC_SSO_TDL_AUTHSCRIPT_DOMAIN}/v2/tdl-sso-auth.js`}
          async
          strategy="afterInteractive"
        ></Script>

        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_KEY}`}
          async
          strategy="afterInteractive"
        ></Script>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
