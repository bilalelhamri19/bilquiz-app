import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Calendar, Clock, BookOpen } from "lucide-react";
import { articles, Article } from "@/data/articles";
import SiteLayout from "@/components/SiteLayout";

export default function Blog() {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  return (
    <>
      <Head>
        <title>مدونة الألغاز وتنشيط العقل - BilQuiz</title>
        <meta name="description" content="اقرأ مقالات ونصائح مفيدة حول كيفية تطوير تفكيرك المنطقي وتنشيط ذاكرتك من خلال الألغاز والألعاب الذهنية." />
        <link rel="canonical" href="https://bilquiz1.com/blog" />
      </Head>

      <SiteLayout>
        <main className="flex-1 px-4 py-10 text-right">
          <AnimatePresence mode="wait">
            {!activeArticle ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-black text-white mb-3">
                    مدونة <span className="gradient-text">المعرفة والعقل</span> 🧠
                  </h1>
                  <p className="text-white/50 max-w-md mx-auto">
                    نصائح، مقالات ومعلومات شيقة لتطوير ذكائك ومهاراتك الفكرية يومياً.
                  </p>
                </div>

                <div className="grid gap-6">
                  {articles.map((article, idx) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setActiveArticle(article)}
                      className="glass glass-hover p-6 rounded-3xl border border-white/10 cursor-pointer text-right flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} className="text-emerald-400" />
                            {article.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-emerald-400" />
                            وقت القراءة: {article.readTime}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 hover:text-emerald-400 transition-colors">
                          {article.title}
                        </h2>
                        <p className="text-white/60 leading-relaxed text-sm mb-4">
                          {article.excerpt}
                        </p>
                      </div>
                      <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 self-start mt-2">
                        اقرأ المزيد <ChevronRight size={14} className="rotate-180" />
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.article
                key="detail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass p-6 sm:p-8 rounded-3xl border border-white/10 text-right"
              >
                <button
                  onClick={() => setActiveArticle(null)}
                  className="btn-ghost-dark rounded-xl px-4 py-2 text-xs text-white/50 hover:text-white flex items-center gap-1.5 mb-6"
                >
                  <ChevronRight size={16} /> العودة لقائمة المقالات
                </button>

                <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-emerald-400" />
                    {activeArticle.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} className="text-emerald-400" />
                    وقت القراءة: {activeArticle.readTime}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
                  {activeArticle.title}
                </h1>

                <div className="text-white/80 leading-loose text-base whitespace-pre-line space-y-4">
                  {activeArticle.content}
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </main>
      </SiteLayout>
    </>
  );
}
