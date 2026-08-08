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
        <meta name="theme-color" content="#10b981" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
