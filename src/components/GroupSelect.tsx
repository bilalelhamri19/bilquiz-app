
import { motion } from "framer-motion";
import { Lock, CheckCircle, Star, ChevronLeft } from "lucide-react";
import { getStars } from "@/lib/scoring";

export interface GroupInfo {
  index: number;
  label: string; // e.g. "المجموعة 1"
  questionCount: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  score?: number; // score out of questionCount
}

interface GroupSelectProps {
  groups: GroupInfo[];
  onSelectGroup: (groupIndex: number) => void;
  dir?: "rtl" | "ltr";
}

const GroupSelect = ({ groups, onSelectGroup, dir = "rtl" }: GroupSelectProps) => {
  return (
    <div dir={dir} className="w-full max-w-2xl mx-auto px-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl font-black text-white mb-3">
          اختر <span className="gradient-text">المجموعة</span>
        </h2>
        <p className="text-white/50 text-lg">
          أكمل كل مجموعة لفتح التالية 🔓
        </p>
      </motion.div>

      {/* Groups Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {groups.map((group, i) => {
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
                  style={{
                    boxShadow: "inset 0 0 20px rgba(99,102,241,0.1)",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default GroupSelect;
