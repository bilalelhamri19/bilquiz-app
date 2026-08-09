import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import { ReactNode } from "react";

interface SiteLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

export const SiteFooter = () => (
  <footer className="border-t border-white/5 px-4 py-5 sm:px-6">
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-center sm:flex-row sm:text-right">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-xl border border-emerald-400/20">
          <Image src="/logo.jpeg" alt="BilQuiz" width={40} height={40} className="h-full w-full object-cover" />
        </div>
        <div>
          <p dir="ltr" className="font-black tracking-wide text-white">BilQuiz</p>
          <p className="mt-0.5 text-xs text-white/40">ألغاز وأسئلة لتختبر ذكاءك</p>
        </div>
      </div>
      <nav aria-label="روابط BilQuiz" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-bold text-white/55">
        <Link href="/blog" className="transition-colors hover:text-emerald-300">المدونة</Link>
        <Link href="/about" className="transition-colors hover:text-emerald-300">من نحن</Link>
        <Link href="/contact" className="transition-colors hover:text-emerald-300">تواصل معنا</Link>
        <Link href="/privacy" className="transition-colors hover:text-emerald-300">سياسة الخصوصية</Link>
        <span className="text-white/25">© 2026</span>
      </nav>
    </div>
  </footer>
);

const SiteLayout = ({ children, pageTitle }: SiteLayoutProps) => (
  <div dir="rtl" className="bg-app flex min-h-screen flex-col overflow-hidden">
    <header className="border-b border-white/5 px-4 py-3 sm:px-6 sm:py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-xl">
            <Image src="/logo.jpeg" alt="BilQuiz" width={40} height={40} priority className="h-full w-full object-cover" />
          </div>
          <span dir="ltr" className="font-bold text-lg text-white">
            {pageTitle ?? "BilQuiz"}
          </span>
        </Link>
        <Link href="/" className="btn-ghost-dark inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white/70 hover:text-white">
          <Home size={18} /> الرئيسية
        </Link>
      </div>
    </header>
    {children}
    <SiteFooter />
  </div>
);

export default SiteLayout;
