import Head from "next/head";
import Link from "next/link";
import { CheckCircle2, Home, Send } from "lucide-react";

const ContactSuccessPage = () => (
  <>
    <Head>
      <title>تم إرسال الرسالة | BilQuiz</title>
      <meta name="robots" content="noindex" />
    </Head>
    <main dir="rtl" className="bg-app flex min-h-screen items-center justify-center px-4 py-10 text-center text-white">
      <section className="glass w-full max-w-md rounded-3xl p-8 sm:p-10">
        <CheckCircle2 className="mx-auto text-emerald-400" size={64} />
        <h1 className="mt-5 text-3xl font-black">تم إرسال رسالتك بنجاح</h1>
        <p className="mt-4 leading-8 text-white/65">شكراً لتواصلك معنا. سنقرأ رسالتك ونرد عليك عبر البريد الإلكتروني في أقرب وقت ممكن.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/" className="btn-primary flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-black"><Home size={18} /> العودة للعبة</Link>
          <Link href="/contact" className="btn-ghost-dark flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-black"><Send size={18} /> رسالة أخرى</Link>
        </div>
      </section>
    </main>
  </>
);

export default ContactSuccessPage;
