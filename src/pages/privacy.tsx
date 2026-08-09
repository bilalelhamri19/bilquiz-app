import Head from "next/head";
import Link from "next/link";
import { Home } from "lucide-react";

const PrivacyPage = () => (
  <>
    <Head>
      <title>سياسة الخصوصية | BilQuiz</title>
      <meta name="description" content="سياسة خصوصية تطبيق BilQuiz." />
    </Head>

    <main dir="rtl" className="bg-app min-h-screen px-4 py-10 text-right text-white">
      <article className="glass mx-auto max-w-3xl rounded-3xl p-6 sm:p-10">
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-emerald-400/10 px-3 py-2 text-sm font-bold text-emerald-300 transition-colors hover:bg-emerald-400/20 hover:text-emerald-200"><Home size={17} /> الرئيسية</Link>

        <h1 className="mt-6 text-3xl font-black">سياسة الخصوصية لتطبيق BilQuiz</h1>
        <p className="mt-2 text-sm text-white/50">آخر تحديث: 9 أغسطس 2026</p>

        <section className="mt-8 space-y-4 leading-8 text-white/75">
          <p>
            BilQuiz لعبة ألغاز. نحترم خصوصيتك ونسعى إلى تقليل البيانات التي نتعامل معها إلى الحد الأدنى.
          </p>

          <div>
            <h2 className="text-xl font-black text-white">البيانات التي يخزنها التطبيق</h2>
            <p>
              يحتفظ BilQuiz محلياً على جهازك فقط بتقدمك في اللعبة، عدد النقاط، وإعداد تشغيل الصوت. لا نرسل هذه المعلومات إلى خادم تابع لنا ولا نبيعها أو نشاركها مع جهات أخرى.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white">التواصل معنا</h2>
            <p>
              إذا أرسلت رسالة من صفحة التواصل، فإننا نتلقى الاسم والبريد الإلكتروني ومحتوى رسالتك للرد على طلبك. تتم معالجة هذه الرسائل بواسطة خدمة FormSubmit، ولا نستخدمها للتسويق أو نشاركها مع جهات أخرى.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white">الحسابات والأذونات</h2>
            <p>
              لا يطلب التطبيق إنشاء حساب، ولا يطلب الوصول إلى الموقع الجغرافي أو الكاميرا أو الميكروفون أو جهات الاتصال أو الملفات الشخصية.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white">الخدمات الخارجية</h2>
            <p>
              يستخدم الموقع خطوط Google Fonts وخدمات Google AdSense. قد تتلقى Google معلومات تقنية معتادة مثل عنوان IP وبيانات الطلب، وقد تستخدم ملفات تعريف الارتباط أو معرّفات الإعلانات لعرض وقياس الإعلانات وفقاً لسياسة خصوصية Google. لا يستخدم BilQuiz أدوات تحليلات أو إعلانات من جهات أخرى.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white">الأطفال</h2>
            <p>
              لا يجمع BilQuiz بيانات شخصية من المستخدمين، بمن فيهم الأطفال.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white">التغييرات والتواصل</h2>
            <p>
              قد نحدّث هذه السياسة عند تغيير وظائف التطبيق. للاستفسارات أو طلب حذف بيانات التقدم المحلية، استعمل صفحة التواصل أو افتح طلباً عبر صفحة مشروع BilQuiz على GitHub. يمكنك أيضاً حذف بيانات التطبيق من إعدادات جهازك أو من بيانات المتصفح.
            </p>
            <Link href="/contact" className="mt-3 inline-block font-bold text-emerald-300 underline underline-offset-4 hover:text-emerald-200">صفحة التواصل</Link>
            <a
              className="font-bold text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
              href="https://github.com/bilalelhamri19/bilquiz-app/issues"
              target="_blank"
              rel="noreferrer"
            >
              التواصل عبر GitHub
            </a>
          </div>
        </section>
      </article>
    </main>
  </>
);

export default PrivacyPage;
