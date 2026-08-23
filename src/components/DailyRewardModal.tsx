import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, Coins, Calendar, Sparkles } from "lucide-react";
import { DAILY_REWARDS } from "@/data/achievements";
import confetti from "canvas-confetti";

interface DailyRewardModalProps {
  open: boolean;
  streak: number;
  lastClaimedDay: number | null;
  onClaim: (coins: number, day: number) => void;
  onClose: () => void;
}

const DailyRewardModal = ({ open, streak, lastClaimedDay, onClaim, onClose }: DailyRewardModalProps) => {
  const todayIndex = (streak - 1) % 7;
  const claimedMask = new Set<number>();
  if (lastClaimedDay && lastClaimedDay > 0) {
    for (let i = 1; i <= Math.min(lastClaimedDay, 7); i++) claimedMask.add(i);
  }

  const currentDayNumber = todayIndex + 1;
  const canClaimToday = !claimedMask.has(currentDayNumber);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md glass rounded-3xl border border-white/10 p-6 sm:p-8 text-right"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500">
                    <Gift size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">المكافآت اليومية</h2>
                    <p className="text-xs text-white/50 mt-0.5 flex items-center gap-1">
                      <Calendar size={12} /> سلسلة اللعب: <span className="text-amber-400 font-black">{streak}</span> أيام
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-white/40 hover:bg-white/5 hover:text-white transition"
                aria-label="إغلاق"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-7 grid grid-cols-7 gap-2">
              {DAILY_REWARDS.map((r, i) => {
                const isClaimed = claimedMask.has(r.day);
                const isToday = i === todayIndex;
                return (
                  <div
                    key={r.day}
                    className={`relative rounded-2xl p-2 text-center border transition-all ${
                      isToday && !isClaimed
                        ? "border-amber-400/50 bg-amber-400/10 ring-2 ring-amber-400/40"
                        : isClaimed
                        ? "border-emerald-400/30 bg-emerald-400/5"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <div className="text-[10px] text-white/50 font-bold">اليوم {r.day}</div>
                    <div className={`my-1.5 text-xl ${isToday && !isClaimed ? "animate-bounce-slow" : ""}`}>
                      {isClaimed ? "✅" : r.day === 7 ? "🎁" : r.day % 3 === 0 ? "💎" : "🪙"}
                    </div>
                    <div className="flex items-center justify-center gap-0.5 text-[10px] font-black text-amber-400">
                      <Coins size={10} />
                      {r.coins}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/20">
              <div className="flex items-center gap-2 text-amber-300">
                <Sparkles size={16} />
                <h3 className="font-black">جائزة اليوم</h3>
              </div>
              <p className="mt-2 text-sm leading-7 text-white/70">
                اليوم يوم {currentDayNumber}: <span className="font-black text-white">+{DAILY_REWARDS[todayIndex].coins} قطعة ذهب</span>
                {currentDayNumber === 7 && " 🎉"}
              </p>
              <button
                onClick={() => {
                  if (canClaimToday) {
                    onClaim(DAILY_REWARDS[todayIndex].coins, currentDayNumber);
                    confetti({
                      particleCount: 80,
                      spread: 60,
                      origin: { y: 0.7 },
                      colors: ['#fbbf24', '#f59e0b', '#d97706'],
                    });
                  }
                }}
                disabled={!canClaimToday}
                className={`mt-4 w-full rounded-2xl py-3.5 font-black flex items-center justify-center gap-2 transition-all ${
                  canClaimToday
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:brightness-110 shadow-lg shadow-amber-500/20"
                    : "bg-white/5 text-white/40 cursor-not-allowed"
                }`}
              >
                {canClaimToday ? (
                  <>
                    <Gift size={18} /> استلام المكافأة الآن
                  </>
                ) : (
                  <>
                    <Coins size={18} /> تم استلامها اليوم
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DailyRewardModal;
