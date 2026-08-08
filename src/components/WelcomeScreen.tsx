

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Language } from "@/data/riddles";
import { ui } from "@/data/i18n";

interface WelcomeScreenProps {
  language: Language;
  onStartQuiz: () => void;
}

const WelcomeScreen = ({ language, onStartQuiz }: WelcomeScreenProps) => {
  const t = ui[language];

  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center px-4 py-12" dir="rtl">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-12"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl pulse-glow"
          style={{
            background: "linear-gradient(135deg, #10b981, #6366f1)",
          }}
        >
          <Trophy className="h-12 w-12 text-white" />
        </motion.div>

        <h1 className="text-5xl sm:text-6xl font-black mb-2 leading-tight">
          <span className="gradient-text">بيلكويز</span>
        </h1>
        <p dir="ltr" className="text-sm font-black tracking-[0.35em] text-emerald-300/80 mb-4">BilQuiz</p>
        <p className="text-xl text-white/60 max-w-md mx-auto leading-relaxed">
          {t.tagline}
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
      >
        <button
          onClick={onStartQuiz}
          className="btn-primary rounded-2xl px-12 py-4 text-xl font-bold tracking-wide shadow-2xl"
        >
          {t.start} ✦
        </button>
        <p className="mt-4 text-sm text-white/30">ابدأ التحدي الآن — مجاناً بالكامل</p>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
