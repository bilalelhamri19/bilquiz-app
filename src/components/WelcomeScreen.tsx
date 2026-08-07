
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, Zap, Globe, Trophy } from "lucide-react";
import { Language } from "@/data/riddles";
import { ui } from "@/data/i18n";

interface WelcomeScreenProps {
  language: Language;
  onStartQuiz: () => void;
}

const features = [
  {
    icon: Brain,
    title: "أكثر من 1000 سؤال",
    desc: "قاعدة أسئلة ضخمة تجعل كل جلسة تجربة جديدة.",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    glow: "glow-emerald",
  },
  {
    icon: Zap,
    title: "تلميحات ذكية",
    desc: "ثلاثة أنواع من التلميحات لمساعدتك على الإجابة.",
    color: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
    glow: "glow-purple",
  },
  {
    icon: Globe,
    title: "بالعربية فقط",
    desc: "تجربة مصممة بالكامل باللغة العربية.",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    glow: "glow-blue",
  },
];

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

        <h1 className="text-5xl sm:text-6xl font-black mb-4 leading-tight">
          <span className="gradient-text">تحدي الألغاز</span>
        </h1>
        <p className="text-xl text-white/60 max-w-md mx-auto leading-relaxed">
          {t.tagline}
        </p>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid w-full max-w-3xl gap-4 sm:grid-cols-3 mb-12"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className={`glass glass-hover rounded-3xl p-6 text-right ${f.border}`}
          >
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} mb-4`}>
              <f.icon className={`h-6 w-6 ${f.iconColor}`} />
            </div>
            <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
            <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
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
