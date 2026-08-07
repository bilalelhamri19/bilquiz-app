
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import { Language } from "@/data/riddles";
import { ui } from "@/data/i18n";

interface ScoreDisplayProps {
  score: number;
  total: number;
  language: Language;
}

const ScoreDisplay = ({ score, total, language }: ScoreDisplayProps) => {
  const percentage = (score / total) * 100;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-4 mb-6"
    >
      <div className="w-14 h-14">
        <CircularProgressbar
          value={percentage}
          text={`${score}`}
          styles={buildStyles({
            textSize: "30px",
            pathColor: `rgba(99, 102, 241, ${percentage / 100})`,
            textColor: "#6366f1",
            trailColor: "#eef2ff",
          })}
        />
      </div>
      <div className="text-muted-foreground">{ui[language].outOf(score, total)}</div>
    </motion.div>
  );
};

export default ScoreDisplay;
