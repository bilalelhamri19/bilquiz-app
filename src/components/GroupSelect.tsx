
import { motion } from "framer-motion";
import { Lock, CheckCircle, Star, ChevronLeft } from "lucide-react";
import { getStars } from "@/lib/scoring";

const BATCH_SIZE = 6;

const getDifficulty = (index: number) => {
  if (index < 5) return { label: "مبتدئ", style: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" };
  if (index < 10) return { label: "متوسط", style: "text-amber-400 border-amber-400/30 bg-amber-400/10" };
  return { label: "صعب", style: "text-rose-400 border-rose-400/30 bg-rose-400/10" };
};

export interface GroupInfo {
  index: number;
  label: string;
  questionCount: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  score?: number;
}

interface GroupSelectProps {
  groups: GroupInfo[];
  onSelectGroup: (groupIndex: number) => void;
  dir?: "rtl" | "ltr";
}

const GroupSelect = ({ groups, onSelectGroup, dir = "rtl" }: GroupSelectProps) => {
  // Keep previously revealed groups on screen. Each time the player reaches a
  // new batch, six more group cards are added below the existing ones.
  const lastUnlockedIndex = groups.reduce((last, g, i) => g.isUnlocked ? i : last, 0);
  const revealedGroupCount = Math.min(
    (Math.floor(lastUnlockedIndex / BATCH_SIZE) + 1) * BATCH_SIZE,
    groups.length
  );
  const visibleGroups = groups.slice(0, revealedGroupCount);

  return (
    <div dir={dir} className="w-full max-w-2xl mx-auto px-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-black text-white mb-3">
          اختر <span className="gradient-text">المجموعة</span>
        </h2>
        <p className="text-white/50 text-lg mb-4">
          أكمل كل مجموعة لفتح التالية 🔓
        </p>

      </motion.div>

      {/* Groups Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {visibleGroups.map((group, i) => {
          const stars = group.isCompleted ? getStars(group.score ?? 0, group.questionCount) : 0;
          const isPlayable = group.isUnlocked;

          return (
            <motion.button
              key={group.index}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 200 }}
              onClick={() => isPlayable && onSelectGroup(group.index)}
              disabled={!isPlayable}
              className={`relative rounded-2xl p-5 text-right transition-all duration-300 ${
                isPlayable
                  ? group.isCompleted
                    ? "glass border border-emerald-500/30 cursor-pointer hover:border-emerald-400/50"
                    : "glass glass-hover cursor-pointer border border-white/10"
                  : "bg-white/3 border border-white/5 cursor-not-allowed opacity-50"
              }`}
            >
              {/* Group Number */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    group.isCompleted
                      ? "bg-emerald-500/20 text-emerald-400"
                      : group.isUnlocked
                      ? "bg-violet-500/20 text-violet-400"
                      : "bg-white/5 text-white/30"
                  }`}
                >
                  {group.isCompleted ? "✓ مكتمل" : group.isUnlocked ? "متاح" : "مقفل"}
                </span>
                {!isPlayable ? (
                  <Lock className="h-5 w-5 text-white/20" />
                ) : group.isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : (
                  <ChevronLeft className="h-5 w-5 text-white/40" />
                )}
              </div>

              <div className="flex flex-col mb-1">
                <p className="text-white font-black text-2xl">{group.index + 1}</p>
                <div className="flex items-center gap-2 mt-1 justify-end">
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDifficulty(group.index).style}`}>
                      {getDifficulty(group.index).label}
                   </span>
                   <p className="text-white/40 text-xs">{group.questionCount} سؤال</p>
                </div>
              </div>

              {/* Stars */}
              {group.isCompleted && (
                <div className="flex gap-0.5 mt-3">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s <= stars ? "text-amber-400 fill-amber-400" : "text-white/15"}
                    />
                  ))}
                </div>
              )}

              {/* Score */}
              {group.isCompleted && group.score !== undefined && (
                <p className="text-emerald-400 text-xs font-bold mt-1">
                  {group.score}/{group.questionCount}
                </p>
              )}

              {/* Glow for active group */}
              {group.isUnlocked && !group.isCompleted && (
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ boxShadow: "inset 0 0 20px rgba(99,102,241,0.1)" }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Total progress footer */}
      <p className="text-center text-white/20 text-xs mt-8">
        تظهر المجموعات 1 إلى {revealedGroupCount} من {groups.length}
      </p>
    </div>
  );
};

export default GroupSelect;
