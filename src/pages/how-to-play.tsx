import Head from "next/head";
import Link from "next/link";
import { CircleHelp, Lightbulb, Target, Trophy } from "lucide-react";

const steps = [
  { icon: CircleHelp, title: "اختر مجموعة", text: "ابدأ بالمجموعة المفتوحة واختر السؤال الذي تريد حله." },
  { icon: Lightbulb, title: "فكّر واستعمل التلميح", text: "اكتب جوابك، واستعمل التلميح عند الحاجة مقابل النقاط." },
  { icon: Target, title: "اجمع الإجابات الصحيحة", text: "تحتاج 6 إجابات صحيحة من أصل 10 لفتح المجموعة التالية." },
  { icon: Trophy, title: "تحدَّ أصدقاءك", text: "شارك رابط اللعبة واعرف من يحقق أفضل نتيجة." },
];

const HowToPlayPage = () => (
  <>
    <Head>
      <title>كيف تلعب | BilQuiz</title>
      <meta name="description" content="تعلم طريقة اللعب في BilQuiz وتحد أصدقاءك." />
    </Head>
    <main dir="rtl" className="bg-app min-h-screen px-4 py-10 text-right text-white">
      <section className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-emerald-300 hover:text-emerald-200">← العودة إلى اللعبة</Link>
        <div className="mt-6 text-center">
          <span className="text-4xl">🎮</span>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">كيف تلعب BilQuiz؟</h1>
          <p className="mt-3 text-white/60">ألغاز، تحدٍّ، ومتعة في دقائق قليلة.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 font-black text-emerald-300">{index + 1}</span>
                <Icon className="text-violet-300" size={22} />
                <h2 className="font-black">{title}</h2>
              </div>
              <p className="mt-3 leading-7 text-white/60">{text}</p>
            </article>
          ))}
        </div>
        <section className="glass mt-8 rounded-2xl p-5 text-white/70">
          <h2 className="font-black text-white">قواعد اللعب</h2>
          <p className="mt-3 leading-7">خصك 6 أجوبة صحيحة من 10 باش تحل المجموعة التالية.</p>
          <p className="mt-2 leading-7">كل جواب صحيح كيعطيك 5 coins، والتلميح كيكلف 10 coins.</p>
        </section>
      </section>
    </main>
  </>
);

export default HowToPlayPage;
