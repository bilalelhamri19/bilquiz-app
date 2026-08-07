
import { motion } from "framer-motion";
import { Star, RotateCcw, ChevronLeft, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface GroupResultProps {
  groupIndex: number;
  score: number;
  total: number;
  isLastGroup: boolean;
  onNextGroup: () => void;
  onBackToGroups: () => void;
  onReplayGroup: () => void;
}

const getStars = (score: number, total: number) => {
  const pct = (score / total) * 100;
  if (pct >= 90) return 3;
  if (pct >= 60) return 2;
  if (pct >= 30) return 1;
  return 0;
};

const GroupResult = ({
  groupIndex,
  score,
  total,
  isLastGroup,
  onNextGroup,
  onBackToGroups,
  onReplayGroup,
}: GroupResultProps) => {
  const pct = Math.round((score / total) * 100);
  const stars = getStars(score, total);

  useEffect(() => {
    if (stars >= 2) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#10b981", "#6366f1", "#f59e0b"],
      });
    }
  }, [stars]);

  const getMessage = () => {
    if (pct >= 90) return "رائع! أنت بطل هذه المجموعة! 🏆";
    if (pct >= 60) return "أداء جيد! استمر على هذا المستوى 💪";
    if (pct >= 30) return "لا بأس! حاول مرة أخرى لتحسين نتيجتك";
    return "تحتاج مزيداً من التدرب، لا تستسلم!";
  };

  return (
    <motion.div
      dir="rtl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto text-center"
    >
      {/* Trophy / Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.1 }}
        className="mx-auto mb-6 h-24 w-24 flex items-center justify-center rounded-3xl pulse-glow"
        style={{
          background:
            stars === 3
              ? "linear-gradient(135deg, #f59e0b, #ef4444)"
              : stars === 2
              ? "linear-gradient(135deg, #10b981, #6366f1)"
              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
        }}
      >
        <Trophy className="h-12 w-12 text-white" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-black text-white mb-2"
      >
        المجموعة {groupIndex + 1} مكتملة!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white/50 mb-8"
      >
        {getMessage()}
      </motion.p>

      {/* Stars */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        className="flex justify-center gap-3 mb-8"
      >
        {[1, 2, 3].map((s, i) => (
          <motion.div
            key={s}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
          >
            <Star
              size={48}
              className={
                s <= stars
                  ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                  : "text-white/15"
              }
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-5 mb-6 grid grid-cols-2 gap-4"
      >
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">الإجابات</p>
          <p className="gradient-text text-3xl font-black">{score}/{total}</p>
        </div>
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">الدقة</p>
          <p className="gradient-text-gold text-3xl font-black">{pct}%</p>
        </div>
      </motion.div>

      {/* Unlock Message */}
      {!isLastGroup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-xl p-3 mb-6 border border-emerald-500/20 flex items-center gap-3"
        >
          <span className="text-2xl">🔓</span>
          <p className="text-emerald-400 text-sm font-bold">
            تم فتح المجموعة {groupIndex + 2}!
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        {!isLastGroup && (
          <button
            onClick={onNextGroup}
            className="btn-primary w-full rounded-2xl py-4 text-base font-bold flex items-center justify-center gap-2"
          >
            المجموعة التالية
            <ChevronLeft size={18} />
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onReplayGroup}
            className="btn-ghost-dark rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2"
          >
            <RotateCcw size={15} />
            إعادة المجموعة
          </button>
          <button
            onClick={onBackToGroups}
            className="btn-ghost-dark rounded-xl py-3 text-sm font-medium"
          >
            قائمة المجموعات
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GroupResult;
