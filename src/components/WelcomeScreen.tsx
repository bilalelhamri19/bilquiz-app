import { motion } from "framer-motion";
import Image from "next/image";
import { ui } from "@/data/i18n";
import { Trophy, Coins, CheckCircle, Award } from "lucide-react";

interface WelcomeScreenProps {
  onStartQuiz: () => void;
  coins: number;
  completedGroupsCount: number;
  totalGroupsCount: number;
}

const WelcomeScreen = ({
  onStartQuiz,
  coins,
  completedGroupsCount,
  totalGroupsCount,
}: WelcomeScreenProps) => {
  const t = ui.ar;

  // Determine user rank based on completed groups
  const getUserRank = () => {
    if (completedGroupsCount === 0) return { title: "مبتدئ 🛡️", color: "text-slate-400" };
    if (completedGroupsCount < 3) return { title: "ذكي 🧠", color: "text-blue-400" };
    if (completedGroupsCount < 7) return { title: "محترف ⚡", color: "text-amber-400" };
    if (completedGroupsCount < 15) return { title: "عبقري 🔮", color: "text-violet-400" };
    return { title: "أسطورة الألغاز 🏆", color: "text-emerald-400 font-extrabold" };
  };

  const rank = getUserRank();
  const progressPercent = Math.round((completedGroupsCount / totalGroupsCount) * 100) || 0;

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
        className="w-full max-w-md mb-10 glass rounded-3xl p-6 border border-white/10"
      >
        <h3 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4">إحصائيات الإنجاز الخاصة بك</h3>
        <div className="grid grid-cols-3 gap-3">
          {/* Rank */}
          <div className="bg-white/3 rounded-2xl p-3 border border-white/5 flex flex-col items-center justify-center">
            <Award className="h-5 w-5 text-violet-400 mb-1.5" />
            <span className="text-[10px] text-white/40 mb-0.5">الرتبة الحالية</span>
            <span className={`text-xs font-black ${rank.color}`}>{rank.title}</span>
          </div>

          {/* Coins */}
          <div className="bg-white/3 rounded-2xl p-3 border border-white/5 flex flex-col items-center justify-center">
            <Coins className="h-5 w-5 text-amber-400 mb-1.5" />
            <span className="text-[10px] text-white/40 mb-0.5">العملات المجمعة</span>
            <span className="text-xs font-black text-amber-300">{coins} 🪙</span>
          </div>

          {/* Progress */}
          <div className="bg-white/3 rounded-2xl p-3 border border-white/5 flex flex-col items-center justify-center">
            <Trophy className="h-5 w-5 text-emerald-400 mb-1.5" />
            <span className="text-[10px] text-white/40 mb-0.5">المجموعات المنجزة</span>
            <span className="text-xs font-black text-emerald-400">{completedGroupsCount} / {totalGroupsCount}</span>
          </div>
        </div>

        {/* ProgressBar */}
        <div className="mt-5">
          <div className="flex justify-between text-[10px] text-white/40 mb-1.5">
            <span>معدل الإنجاز الكلي</span>
            <span>{progressPercent}%</span>
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

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
      >
        <button
          onClick={onStartQuiz}
          className="btn-primary rounded-2xl px-12 py-4 text-xl font-bold tracking-wide shadow-2xl shadow-emerald-500/20"
        >
          {t.start} ✦
        </button>
        <p className="mt-4 text-sm text-white/30">ابدأ التحدي الآن — مجاناً بالكامل</p>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
