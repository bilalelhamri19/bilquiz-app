import Head from "next/head";
import { Mail, Send } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";

const ContactPage = () => (
  <>
    <Head>
      <title>تواصل معنا | BilQuiz</title>
      <meta name="description" content="أرسل اقتراحك أو رسالتك إلى فريق BilQuiz." />
    </Head>
    <SiteLayout>
    <main className="flex-1 px-4 py-10 text-right text-white">
      <section className="glass mx-auto max-w-xl rounded-3xl p-6 sm:p-10">
        <div className="mt-7 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300"><Mail size={28} /></div>
          <h1 className="mt-4 text-3xl font-black">تواصل معنا</h1>
          <p className="mt-3 leading-7 text-white/60">عندك اقتراح للعبة، لغز جديد، أو مشكل؟ أرسل لنا رسالتك.</p>
        </div>

        <form action="https://formsubmit.co/bilalelhamri2006@gmail.com" method="POST" className="mt-8 space-y-4">
          <input type="hidden" name="_subject" value="رسالة جديدة من BilQuiz" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_next" value="https://bilquiz1.com/contact-success" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-white/80">الاسم</span>
            <input className="input-dark w-full rounded-xl px-4 py-3" type="text" name="name" required placeholder="اكتب اسمك" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-white/80">البريد الإلكتروني</span>
            <input className="input-dark w-full rounded-xl px-4 py-3 text-left" dir="ltr" type="email" name="email" required placeholder="name@example.com" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-white/80">الرسالة</span>
            <textarea className="input-dark min-h-36 w-full resize-y rounded-xl px-4 py-3" name="message" required placeholder="كيف يمكننا مساعدتك؟" />
          </label>
          <button type="submit" className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-black">
            <Send size={19} /> إرسال الرسالة
          </button>
        </form>
        <p className="mt-5 text-center text-xs leading-6 text-white/40">عند الإرسال، تُرسل رسالتك إلى بريد BilQuiz لمعالجتها والرد عليك.</p>
      </section>
    </main>
    </SiteLayout>
  </>
);

export default ContactPage;
