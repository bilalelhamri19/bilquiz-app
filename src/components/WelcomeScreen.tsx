import { motion } from "framer-motion";
import Image from "next/image";
import { ui } from "@/data/i18n";
import { Trophy, Coins, Award, Star, Flame, Sparkles, Share2, Compass } from "lucide-react";
import { useState } from "react";

interface WelcomeScreenProps {
  onStartQuiz: () => void;
  coins: number;
  completedGroupsCount: number;
  totalGroupsCount: number;
  rankTitle: string;
  totalStars: number;
  maxStars: number;
}

const WelcomeScreen = ({
  onStartQuiz,
  coins,
  completedGroupsCount,
  totalGroupsCount,
  rankTitle,
  totalStars,
  maxStars,
}: WelcomeScreenProps) => {
  const t = ui.ar;
  const [copied, setCopied] = useState(false);

  const rankBadgeColor = (title: string) => {
    if (title.includes("أسطورة")) return "text-emerald-400 font-extrabold";
    if (title.includes("عبقري")) return "text-violet-400";
    if (title.includes("محترف")) return "text-amber-400";
    if (title.includes("ذكي")) return "text-blue-400";
    return "text-slate-400";
  };

  const handleShareApp = async () => {
    const shareText = "🧩 اختبر ذكائك ومرونة عقلك مع تطبيق الألغاز بيلكويز BilQuiz! 🌟 أكثر من 700 لغز وحجاية بـ 4 لغات. جربه الآن مجاناً: https://bilquiz1.com";
    if (navigator.share) {
      try {
        await navigator.share({
          title: "BilQuiz - لعبة الألغاز والذكاء",
          text: shareText,
          url: "https://bilquiz1.com",
        });
        return;
      } catch (e) {}
    }
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const progressPercent = Math.round((completedGroupsCount / totalGroupsCount) * 100) || 0;
  const starsPercent = Math.round((totalStars / Math.max(1, maxStars)) * 100) || 0;
  const rankColor = rankBadgeColor(rankTitle);

  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center px-4 py-8" dir="rtl">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-8"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="mx-auto mb-6 h-24 w-24 overflow-hidden rounded-3xl pulse-glow shadow-emerald-500/20"
        >
          <Image src="/logo.jpeg" alt="BilQuiz" width={96} height={96} priority className="h-full w-full object-cover" />
        </motion.div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
          <Sparkles size={14} />
          <span>أكثر من 700 لغز وحجاية متجددة</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-black mb-2 leading-tight">
          <span className="gradient-text">بيلكويز</span>
        </h1>
        <p dir="ltr" className="text-sm font-black tracking-[0.35em] text-emerald-300/80 mb-4">BilQuiz</p>
        <p className="text-lg text-white/60 max-w-md mx-auto leading-relaxed">
          {t.tagline}
        </p>
      </motion.div>

      {/* Stats Board Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-full max-w-md mb-6 glass rounded-3xl p-6 border border-white/10"
      >
        <h3 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4">إحصائيات الإنجاز الخاصة بك</h3>
        <div className="grid grid-cols-3 gap-3">
          {/* Rank */}
          <div className="bg-white/3 rounded-2xl p-3 border border-white/5 flex flex-col items-center justify-center">
            <Award className="h-5 w-5 text-violet-400 mb-1.5" />
            <span className="text-[10px] text-white/40 mb-0.5">الرتبة الحالية</span>
            <span className={`text-xs font-black ${rankColor}`}>{rankTitle}</span>
          </div>

          {/* Coins */}
          <div className="bg-white/3 rounded-2xl p-3 border border-white/5 flex flex-col items-center justify-center">
            <Coins className="h-5 w-5 text-amber-400 mb-1.5" />
            <span className="text-[10px] text-white/40 mb-0.5">العملات المجمعة</span>
            <span className="text-xs font-black text-amber-300">{coins} 🪙</span>
          </div>

          {/* Stars */}
          <div className="bg-white/3 rounded-2xl p-3 border border-white/5 flex flex-col items-center justify-center">
            <Star className="h-5 w-5 text-amber-400 mb-1.5 fill-amber-400" />
            <span className="text-[10px] text-white/40 mb-0.5">النجوم المجمعة</span>
            <span className="text-xs font-black text-amber-300">{totalStars} ⭐</span>
          </div>
        </div>

        {/* ProgressBar */}
        <div className="mt-5">
          <div className="flex justify-between text-[10px] text-white/40 mb-1.5">
            <span>معدل الإنجاز الكلي ({completedGroupsCount}/{totalGroupsCount} مجموعة)</span>
            <span>{progressPercent}% · {starsPercent}% نجوم</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Feature Highlights Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md mb-8 grid grid-cols-2 gap-3"
      >
        <button
          onClick={onStartQuiz}
          className="glass rounded-2xl p-4 border border-emerald-500/20 text-right hover:border-emerald-500/40 transition flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-emerald-400 font-bold block mb-1">تحدي المجموعات</span>
            <span className="text-white/60 text-[11px]">مستويات متدرجة الصعوبة</span>
          </div>
          <Compass className="text-emerald-400 group-hover:scale-110 transition-transform" size={24} />
        </button>

        <button
          onClick={handleShareApp}
          className="glass rounded-2xl p-4 border border-amber-500/20 text-right hover:border-amber-500/40 transition flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-amber-300 font-bold block mb-1">{copied ? "تم النسخ!" : "شارك مع أصدقائك"}</span>
            <span className="text-white/60 text-[11px]">تحدَّ العائلة والأصحاب</span>
          </div>
          <Share2 className="text-amber-400 group-hover:scale-110 transition-transform" size={22} />
        </button>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
      >
        <button
          onClick={onStartQuiz}
          className="btn-primary rounded-2xl px-12 py-4 text-xl font-bold tracking-wide shadow-2xl shadow-emerald-500/20 flex items-center gap-3 mx-auto"
        >
          <Flame className="h-6 w-6 text-amber-300 animate-pulse" />
          <span>{t.start} ✦</span>
        </button>
        <p className="mt-4 text-sm text-white/30">ابدأ التحدي الذهني الآن — مجاناً بالكامل</p>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;

