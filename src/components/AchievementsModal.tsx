import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X, Lock, CheckCircle2 } from "lucide-react";
import { ACHIEVEMENTS, Achievement } from "@/data/achievements";

interface AchievementsModalProps {
  open: boolean;
  progress: number;
  unlockedIds: string[];
  stats: {
    riddlesSolved: number;
    perfectGroups: number;
    groupsUnlocked: number;
    coinsEarned: number;
    streak: number;
    hintsUsed: number;
    totalStars: number;
  };
  onClose: () => void;
}

const getProgressForAchievement = (a: Achievement, stats: AchievementsModalProps["stats"]): number => {
  switch (a.type) {
    case "riddles_solved":
      return stats.riddlesSolved;
    case "perfect_groups":
      return stats.perfectGroups;
    case "groups_unlocked":
      return stats.groupsUnlocked;
    case "coins_earned":
      return stats.coinsEarned;
    case "streak":
      return stats.streak;
    case "hints_used":
      return stats.hintsUsed;
    case "total_stars":
      return stats.totalStars;
    default:
      return 0;
  }
};

const AchievementsModal = ({ open, unlockedIds, stats, onClose }: AchievementsModalProps) => {
  const unlockedCount = unlockedIds.length;
  const total = ACHIEVEMENTS.length;
  const percent = Math.round((unlockedCount / total) * 100);

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
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto glass rounded-3xl border border-white/10 p-6 sm:p-8 text-right"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-500">
                    <Trophy size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">الإنجازات</h2>
                    <p className="text-xs text-white/50 mt-0.5">
                      <span className="text-emerald-300 font-black">{unlockedCount}</span> / {total} — إنجاز مفتوح ({percent}%)
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-2.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-violet-400 to-fuchsia-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
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

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {ACHIEVEMENTS.map((a) => {
                const current = getProgressForAchievement(a, stats);
                const pct = Math.min(100, Math.round((current / a.goal) * 100));
                const unlocked = unlockedIds.includes(a.id);
                return (
                  <motion.div
                    key={a.id}
                    layout
                    className={`relative overflow-hidden rounded-2xl p-4 border transition-all ${
                      unlocked
                        ? "border-emerald-400/40 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${
                          unlocked ? "bg-emerald-500/15 ring-2 ring-emerald-400/40" : "bg-white/5 opacity-60"
                        }`}
                      >
                        {unlocked ? a.icon : <Lock size={18} className="text-white/50" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className={`font-black truncate ${unlocked ? "text-white" : "text-white/60"}`}>
                            {a.title}
                          </h3>
                          {unlocked && (
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-6 text-white/50 line-clamp-2">{a.description}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                unlocked ? "bg-gradient-to-r from-emerald-400 to-teal-400" : "bg-white/20"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className={`text-[10px] font-black shrink-0 ${unlocked ? "text-emerald-300" : "text-white/40"}`}>
                            {current}/{a.goal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementsModal;
