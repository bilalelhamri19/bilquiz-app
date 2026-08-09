import { motion, AnimatePresence } from "framer-motion";
import { Trophy, CheckCircle2 } from "lucide-react";

interface AchievementToastProps {
  open: boolean;
  achievement: {
    icon: string;
    title: string;
    description: string;
  } | null;
  onClose: () => void;
}

const AchievementToast = ({ open, achievement, onClose }: AchievementToastProps) => {
  if (!achievement) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed top-4 right-4 z-[200] max-w-sm"
          initial={{ opacity: 0, y: -40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
        >
          <div
            onClick={onClose}
            className="glass rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent p-4 text-right cursor-pointer shadow-2xl shadow-emerald-500/10"
          >
            <div className="flex items-start gap-3">
              <motion.div
                className="h-12 w-12 shrink-0 rounded-2xl bg-emerald-500/20 ring-2 ring-emerald-400/40 flex items-center justify-center text-2xl"
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {achievement.icon}
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-black text-emerald-300 flex items-center gap-1">
                    <Trophy size={12} /> إنجاز جديد!
                  </p>
                  <CheckCircle2 size={14} className="text-emerald-400" />
                </div>
                <h3 className="mt-1 font-black text-white truncate">{achievement.title}</h3>
                <p className="mt-1 text-xs leading-5 text-white/55 line-clamp-2">
                  {achievement.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementToast;
