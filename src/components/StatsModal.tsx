import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, X, Target, Zap, TrendingUp, Brain, Clock, Award } from "lucide-react";

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  stats: {
    riddlesSolved: number;
    totalRiddles: number;
    groupsUnlocked: number;
    totalGroups: number;
    totalStars: number;
    maxStars: number;
    totalCoinsEarned: number;
    currentCoins: number;
    hintsUsed: number;
    perfectGroups: number;
    sessionsPlayed: number;
    streak: number;
    rankTitle: string;
    rankProgress: number; // 0 - 100
  };
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  extra,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  extra?: string;
  color: string;
}) => (
  <motion.div
    className="rounded-2xl p-4 border border-white/10 bg-white/[0.03]"
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 250 }}
  >
    <div className="flex items-center gap-2 mb-2">
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
      <span className="text-xs text-white/50 font-bold">{label}</span>
    </div>
    <div className="text-2xl font-black text-white">{value}</div>
    {extra && <div className="mt-1 text-xs text-white/40">{extra}</div>}
  </motion.div>
);

const StatsModal = ({ open, stats, onClose }: StatsModalProps) => {
  const progressPct =
    stats.totalRiddles > 0 ? Math.round((stats.riddlesSolved / stats.totalRiddles * 100) : 0;
  const groupPct =
    stats.totalGroups > 0 ? Math.round((stats.groupsUnlocked / stats.totalGroups * 100) : 0;

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
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500">
                  <BarChart3 size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">الإحصائيات المتقدمة</h2>
                  <p className="text-xs text-white/50 mt-0.5">رحلة عقلك في أرقام</p>
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

            {/* Rank Badge */}
            <div className="mt-6 rounded-3xl p-5 bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 border border-violet-400/20">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-violet-300 font-bold mb-1">رتبتك الحالية</p>
                  <h3 className="text-3xl font-black gradient-text flex items-center gap-2">
                    <Award size={24} />
                    {stats.rankTitle}
                  </h3>
                </div>
                <div className="text-left">
                  <p className="text-xs text-white/50 mb-1">التقدم نحو الرتبة التالية</p>
                  <p className="text-sm font-black text-white">{stats.rankProgress}%</p>
                </div>
              </div>
              <div className="mt-3 h-2.5 w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.rankProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Progress Bars */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl p-4 border border-white/10 bg-white/[0.03]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50 font-bold flex items-center gap-1.5">
                  <Brain size={14} className="text-emerald-400" /> إجمالي الألغاز المحلولة
                </span>
                  <span className="text-xs text-white/40 font-black">{progressPct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{ width: `${progressPct}%`} />
                </div>
                <div className="mt-2 text-sm text-white/60">
                  <span className="font-black text-white">{stats.riddlesSolved}</span> / {stats.totalRiddles} لغز
                </div>
              </div>

              <div className="rounded-2xl p-4 border border-white/10 bg-white/[0.03]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50 font-bold flex items-center gap-1.5">
                  <Target size={14} className="text-violet-400" /> المجموعات المفتوحة
                </span>
                  <span className="text-xs text-white/40 font-black">{groupPct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400" style={{ width: `${groupPct}%`}} />
                </div>
                <div className="mt-2 text-sm text-white/60">
                  <span className="font-black text-white">{stats.groupsUnlocked}</span> / {stats.totalGroups} مجموعة
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <StatCard
                icon={Zap}
                label="النجوم"
                value={`${stats.totalStars}/${stats.maxStars}`}
                extra="المجموعة"
                color="bg-amber-500/15 text-amber-400"
              />
              <StatCard
                icon={TrendingUp}
                label="العملات المكتسبة"
                value={stats.totalCoinsEarned}
                extra={`الحالية: ${stats.currentCoins}`}
                color="bg-yellow-500/15 text-yellow-400"
              />
              <StatCard
                icon={Clock}
                label="الجلسات اللعب"
                value={stats.sessionsPlayed}
                extra="جلسة"
                color="bg-cyan-500/15 text-cyan-400"
              />
              <StatCard
                icon={Brain}
                label="الألغاز المحلولة"
                value={stats.riddlesSolved}
                extra="لغز"
                color="bg-emerald-500/15 text-emerald-400"
              />
              <StatCard
                icon={Target}
                label="مجموعات مثالية"
                value={stats.perfectGroups}
                extra="10/10"
                color="bg-rose-500/15 text-rose-400"
              />
              <StatCard
                icon={Award}
                label="سلسلة الأيام"
                value={stats.streak}
                extra="يوم متتالي"
                color="bg-blue-500/15 text-blue-400"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatsModal;
