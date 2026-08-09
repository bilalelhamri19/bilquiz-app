import Head from "next/head";
import { ChevronLeft, CircleHelp } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";

const questions = [
  {
    question: "ما هو BilQuiz؟",
    answer: "BilQuiz لعبة ألغاز وأسئلة منطقية باللغة العربية. اختر مجموعة، أجب عن الأسئلة، وافتح مستويات جديدة كلما حققت نتائج أفضل.",
  },
  {
    question: "هل اللعبة مجانية؟",
    answer: "نعم، BilQuiz مجانية ويمكن لعبها مباشرة من المتصفح على الهاتف أو الحاسوب دون إنشاء حساب.",
  },
  {
    question: "كيف أفتح المجموعة التالية؟",
    answer: "تحتاج إلى 6 إجابات صحيحة على الأقل من أصل 10 أسئلة في المجموعة الحالية لفتح المجموعة التالية.",
  },
  {
    question: "هل يُحفظ تقدمي؟",
    answer: "نعم، يُحفظ تقدمك والنقاط وإعداد الصوت محلياً على جهازك. إذا مسحت بيانات المتصفح أو التطبيق فقد يبدأ التقدم من جديد.",
  },
  {
    question: "كيف أشارك اللعبة مع أصدقائي؟",
    answer: "اضغط على رمز المشاركة أعلى اللعبة، ثم اختر التطبيق الذي تريد إرسال الرابط عبره.",
  },
  {
    question: "هل يمكنني اللعب على الهاتف؟",
    answer: "نعم، BilQuiz مصمم ليعمل على الهاتف والحاسوب. يمكنك أيضاً إضافته إلى الشاشة الرئيسية من متصفح الهاتف للوصول إليه بسرعة.",
  },
];

const FaqPage = () => (
  <>
    <Head>
      <title>الأسئلة الشائعة | BilQuiz</title>
      <meta name="description" content="إجابات عن الأسئلة الشائعة حول لعبة BilQuiz." />
    </Head>
    <SiteLayout>
    <main className="flex-1 px-4 py-10 text-right text-white">
      <section className="mx-auto max-w-3xl">
        <div className="mt-6 text-center">
          <CircleHelp className="mx-auto text-emerald-300" size={42} />
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">الأسئلة الشائعة</h1>
          <p className="mt-3 text-white/60">كل ما تحتاج معرفته قبل أن تبدأ التحدي.</p>
        </div>
        <div className="mt-10 space-y-3">
          {questions.map(({ question, answer }) => (
            <details key={question} className="glass group rounded-2xl p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-black text-white">
                {question}
                <ChevronLeft size={20} className="shrink-0 text-emerald-300 transition-transform group-open:-rotate-90" />
              </summary>
              <p className="mt-4 border-t border-white/10 pt-4 leading-8 text-white/65">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
    </SiteLayout>
  </>
);

export default FaqPage;
