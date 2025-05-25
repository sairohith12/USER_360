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
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
