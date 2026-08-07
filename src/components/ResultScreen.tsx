
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, RotateCcw, Trophy, Star } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { Language } from "@/data/riddles";
import { ui } from "@/data/i18n";

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  language: Language;
  onRestart: () => void;
}

const ResultScreen = ({ score, totalQuestions, language, onRestart }: ResultScreenProps) => {
  const percentage = (score / totalQuestions) * 100;
  const t = ui[language];

  useEffect(() => {
    if (percentage >= 70) {
      const fire = (particleRatio: number, opts: object) => {
        confetti({
          origin: { y: 0.7 },
          particleCount: Math.floor(200 * particleRatio),
          ...opts,
        });
      };
      fire(0.25, { spread: 26, startVelocity: 55, colors: ["#10b981", "#6366f1"] });
      fire(0.2, { spread: 60, colors: ["#f59e0b", "#ef4444"] });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    }
  }, [percentage]);

  const getEmoji = () => {
    if (percentage >= 90) return "🏆";
    if (percentage >= 70) return "⭐";
    if (percentage >= 50) return "👍";
    return "💪";
  };

  const getRankLabel = () => {
    if (percentage >= 90) return "بطل الألغاز";
    if (percentage >= 70) return "متميز";
    if (percentage >= 50) return "جيد";
    return "استمر في التدرب";
  };

  return (
    <motion.div
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center text-center px-4 py-12"
    >
      <div className="w-full max-w-lg">
        {/* Trophy Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
          className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-3xl pulse-glow"
          style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
        >
          <span className="text-5xl">{getEmoji()}</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black text-white mb-2"
        >
          {t.finished}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/50 text-lg mb-8"
        >
          {t.messages(percentage)}
        </motion.p>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="glass rounded-2xl p-5 text-center">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">النتيجة</p>
            <p className="gradient-text text-4xl font-black">{score}</p>
            <p className="text-white/40 text-sm mt-1">من {totalQuestions}</p>
          </div>
          <div className="glass rounded-2xl p-5 text-center">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">الدقة</p>
            <p className="gradient-text-gold text-4xl font-black">{Math.round(percentage)}%</p>
            <p className="text-white/40 text-sm mt-1">{getRankLabel()}</p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-5 mb-8"
        >
          <div className="flex justify-between text-sm text-white/50 mb-3">
            <span>الأداء العام</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {[0, 25, 50, 75, 100].map((mark) => (
              <span key={mark} className="text-xs text-white/20">{mark}%</span>
            ))}
          </div>
        </motion.div>

        {/* Restart Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={onRestart}
            className="btn-primary w-full rounded-2xl py-4 text-lg font-bold flex items-center justify-center gap-3"
          >
            <RotateCcw size={20} />
            {t.restart}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultScreen;
