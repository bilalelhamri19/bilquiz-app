import Head from "next/head";
import Link from "next/link";
import { Brain, Heart, Home, Sparkles } from "lucide-react";

const AboutPage = () => (
  <>
    <Head>
      <title>من نحن | BilQuiz</title>
      <meta name="description" content="تعرف على BilQuiz، لعبة الألغاز العربية." />
    </Head>
    <main dir="rtl" className="bg-app min-h-screen px-4 py-10 text-right text-white">
      <section className="glass mx-auto max-w-3xl rounded-3xl p-6 sm:p-10">
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-emerald-400/10 px-3 py-2 text-sm font-bold text-emerald-300 transition-colors hover:bg-emerald-400/20 hover:text-emerald-200"><Home size={17} /> الرئيسية</Link>
        <div className="mt-7 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-violet-500"><Brain size={34} /></div>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">عن BilQuiz</h1>
          <p className="mt-4 leading-8 text-white/70">BilQuiz لعبة ألغاز عربية صُممت لتحويل وقت الفراغ إلى تحدٍّ ممتع للعقل. نريد أن تكون الألغاز سهلة الوصول، جميلة على الهاتف، وممتعة عند اللعب مع الأصدقاء.</p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><Sparkles className="text-emerald-300" /><h2 className="mt-3 font-black">محتوى متجدد</h2><p className="mt-2 text-sm leading-7 text-white/60">مئات الأسئلة المنطقية والألغاز المتنوعة لتجربة لا تنتهي بسرعة.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><Heart className="text-violet-300" /><h2 className="mt-3 font-black">لأجل المتعة</h2><p className="mt-2 text-sm leading-7 text-white/60">لعبة خفيفة، بلا حساب، وتحفظ تقدمك محلياً على جهازك.</p></div>
        </div>
        <p className="mt-8 text-center text-sm text-white/45">للتواصل والاقتراحات، راسلنا من خلال صفحة سياسة الخصوصية.</p>
      </section>
    </main>
  </>
);

export default AboutPage;
