
import { motion } from "framer-motion";
import { ui } from "@/data/i18n";

interface ScoreDisplayProps {
  score: number;
  total: number;
}

const ScoreDisplay = ({ score, total }: ScoreDisplayProps) => {
  const percentage = (score / total) * 100;
  const radius = 28;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-4 mb-6"
    >
      <div className="w-14 h-14 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={normalizedRadius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="32"
            cy="32"
            r={normalizedRadius}
            stroke="#6366f1"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 32 32)"
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-xs font-black"
            fill="#6366f1"
          >
            {Math.round(percentage)}%
          </text>
        </svg>
      </div>
      <div className="text-white/50 text-sm">{ui.ar.outOf(score, total)}</div>
    </motion.div>
  );
};

export default ScoreDisplay;
