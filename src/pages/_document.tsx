import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='en-US'>
        <Head>
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            href='https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap'
            rel='stylesheet'
          />
          <link rel='shortcut icon' href='favicon.ico' type='image/x-icon' />

          <meta
            name='description'
            content='The best News subscription about the react world, only for $9.90 monthly'
          />

          <meta
            property='og:image'
            itemProp='image'
            content='/images/avatar.png'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
