import Link from "next/link";

const Custom404 = () => {
  return (
    <div dir="rtl" className="min-h-screen bg-app flex items-center justify-center">
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
    </div>
  );
};

export default Custom404;
