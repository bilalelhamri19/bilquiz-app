import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";

const Custom404 = () => {
  return (
    <SiteLayout>
    <main className="flex flex-1 items-center justify-center px-4 py-10 text-right text-white">
      <div className="text-center">
        <h1 className="text-6xl font-black mb-4 gradient-text">404</h1>
        <p className="text-xl text-white/60 mb-6">الصفحة غير موجودة</p>
        <Link
          href="/"
          className="btn-primary rounded-2xl px-8 py-3 text-base font-bold inline-block"
        >
          العودة للرئيسية
        </Link>
      </div>
    </main>
    </SiteLayout>
  );
};

export default Custom404;
