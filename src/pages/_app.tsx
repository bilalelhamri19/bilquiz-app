import type { AppProps } from "next/app";
import Head from "next/head";
import "../index.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>BilQuiz - العب وتحدى أصدقاءك</title>
        <meta name="description" content="تطبيق ألغاز ممتع لتتحدى أصدقاءك وتختبر ذكاءك مع BilQuiz!" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content="BilQuiz - العب وتحدى أصدقاءك" />
        <meta property="og:description" content="تطبيق ألغاز ممتع لتتحدى أصدقاءك وتختبر ذكاءك مع BilQuiz!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bilquiz1.com" />
        <meta property="og:image" content="https://bilquiz1.com/logo.jpeg" />
        <link rel="canonical" href="https://bilquiz1.com" />
        <meta name="theme-color" content="#10b981" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2122929353158422"
          crossOrigin="anonymous"
        />
        <link rel="icon" type="image/jpeg" href="/logo.jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
