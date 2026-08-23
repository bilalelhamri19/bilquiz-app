import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ar" dir="rtl">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap"
            rel="stylesheet"
          />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#09090b" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
