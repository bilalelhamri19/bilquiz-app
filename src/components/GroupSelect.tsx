
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, CheckCircle, Star, ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import { getStars } from "@/lib/scoring";

const BATCH_SIZE = 10;

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
  // Find the current batch: the batch containing the last unlocked group
  const lastUnlockedIndex = groups.reduce((last, g, i) => g.isUnlocked ? i : last, 0);
  const currentBatch = Math.floor(lastUnlockedIndex / BATCH_SIZE);
  const [viewedBatch, setViewedBatch] = useState(currentBatch);

  // Move forward automatically when a newly unlocked group enters a new batch,
  // while still allowing the player to revisit earlier batches.
  useEffect(() => {
    setViewedBatch((batch) => Math.max(batch, currentBatch));
  }, [currentBatch]);

  const batchStart = viewedBatch * BATCH_SIZE;
  const batchEnd = Math.min(batchStart + BATCH_SIZE, groups.length);
  const visibleGroups = groups.slice(batchStart, batchEnd);

  // Check if all visible groups in current batch are completed
  const allBatchCompleted = visibleGroups.every((g) => g.isCompleted);
  const hasNextBatch = batchEnd < groups.length;

  // Progress in current batch
  const completedInBatch = visibleGroups.filter((g) => g.isCompleted).length;

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

        {/* Batch Progress */}
        <div className="glass rounded-2xl px-3 py-3 inline-flex items-center gap-3">
          <button
            type="button"
            aria-label="المجموعات السابقة"
            onClick={() => setViewedBatch((batch) => Math.max(0, batch - 1))}
            disabled={viewedBatch === 0}
            className="p-1 text-white/60 hover:text-white disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronRight size={18} />
          </button>
          <span className="text-white/40 text-sm">المجموعات {batchStart + 1}–{batchEnd}</span>
          <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-violet-500 rounded-full"
              animate={{ width: `${(completedInBatch / BATCH_SIZE) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-emerald-400 text-sm font-bold">{completedInBatch}/{visibleGroups.length}</span>
          <button
            type="button"
            aria-label="المجموعات التالية"
            onClick={() => setViewedBatch((batch) => Math.min(currentBatch, batch + 1))}
            disabled={viewedBatch >= currentBatch}
            className="p-1 text-white/60 hover:text-white disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
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

              <p className="text-white font-black text-2xl mb-1">{group.index + 1}</p>
              <p className="text-white/40 text-xs">{group.questionCount} سؤال</p>

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

      {/* Next Batch Banner */}
      {allBatchCompleted && hasNextBatch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass rounded-2xl p-5 border border-emerald-500/30 text-center"
        >
          <p className="text-emerald-400 font-bold text-lg mb-1">🎉 أحسنت! أكملت هذه المجموعات!</p>
          <p className="text-white/50 text-sm mb-4">
            المجموعات {batchEnd + 1}–{Math.min(batchEnd + BATCH_SIZE, groups.length)} متاحة الآن
          </p>
          <ChevronDown className="mx-auto text-emerald-400 animate-bounce" size={24} />
        </motion.div>
      )}

      {/* Total progress footer */}
      <p className="text-center text-white/20 text-xs mt-8">
        المجموعة {batchStart + 1} إلى {batchEnd} من {groups.length}
      </p>
    </div>
  );
};

export default GroupSelect;
