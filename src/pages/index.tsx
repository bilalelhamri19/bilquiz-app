
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import QuizCard from "@/components/QuizCard";
import GroupSelect, { GroupInfo } from "@/components/GroupSelect";
import GroupResult from "@/components/GroupResult";
import { riddles, Language } from "@/data/riddles";
import { ui } from "@/data/i18n";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

// ─── Config ────────────────────────────────────────────────────────────────
const QUESTIONS_PER_GROUP = 15;
const STORAGE_KEY = "bilquiz_progress";

// Split riddles into groups of 15
const allGroups = Array.from(
  { length: Math.ceil(riddles.length / QUESTIONS_PER_GROUP) },
  (_, i) => riddles.slice(i * QUESTIONS_PER_GROUP, (i + 1) * QUESTIONS_PER_GROUP)
);

// ─── Types ─────────────────────────────────────────────────────────────────
type AppState = "welcome" | "groupSelect" | "quiz" | "groupResult";

interface Progress {
  unlockedGroups: number[];            // group indices that are unlocked
  completedGroups: Record<number, number>; // groupIndex → best score
}

const loadProgress = (): Progress => {
  if (typeof window === "undefined") {
    return { unlockedGroups: [0], completedGroups: {} };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { unlockedGroups: [0], completedGroups: {} };
};

const saveProgress = (p: Progress) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {}
};

// ─── Component ─────────────────────────────────────────────────────────────
const Index = () => {
  const [appState, setAppState] = useState<AppState>("welcome");
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<Progress>({ unlockedGroups: [0], completedGroups: {} });
  const [hasMounted, setHasMounted] = useState(false);

  // Current session
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [questionInGroup, setQuestionInGroup] = useState(0);
  const [groupScore, setGroupScore] = useState(0);

  const dir = "rtl";
  const language: Language = "ar";

  const { toast } = useToast();
  const t = ui[language];

  const currentGroupQuestions = allGroups[currentGroupIndex] ?? [];
  const currentRiddle = currentGroupQuestions[questionInGroup];
  const totalGroups = allGroups.length;

  useEffect(() => {
    if (!hasMounted) return;
    saveProgress(progress);
  }, [progress, hasMounted]);

  useEffect(() => {
    setHasMounted(true);
    const timer = window.setTimeout(() => setIsLoading(false), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  // Build GroupInfo array for the selector
  const groupInfos: GroupInfo[] = allGroups.map((grp, i) => ({
    index: i,
    label: t.groupOf(i + 1, totalGroups),
    questionCount: grp.length,
    isUnlocked: progress.unlockedGroups.includes(i),
    isCompleted: i in progress.completedGroups,
    score: progress.completedGroups[i],
  }));

  // ── Handlers ────────────────────────────────────────────────────────────
  const startGroup = (groupIndex: number) => {
    setCurrentGroupIndex(groupIndex);
    setQuestionInGroup(0);
    setGroupScore(0);
    setAppState("quiz");
  };

  const handleCorrectAnswer = () => {
    const newScore = groupScore + 1;
    setGroupScore(newScore);
    advanceQuestion(newScore);
  };

  const handleSkip = () => {
    const ans = currentRiddle.translations[language].answers[0];
    toast({ title: t.skipped, description: t.skippedDesc(ans) });
    advanceQuestion(groupScore);
  };

  const advanceQuestion = (score: number) => {
    if (questionInGroup < currentGroupQuestions.length - 1) {
      setQuestionInGroup((q) => q + 1);
    } else {
      // Group finished → update progress
      completeGroup(score);
    }
  };

  const completeGroup = useCallback(
    (score: number) => {
      const newProgress: Progress = {
        unlockedGroups: [...progress.unlockedGroups],
        completedGroups: {
          ...progress.completedGroups,
          [currentGroupIndex]: Math.max(
            score,
            progress.completedGroups[currentGroupIndex] ?? 0
          ),
        },
      };

      // Unlock next group if it exists and isn't already unlocked
      const nextGroup = currentGroupIndex + 1;
      if (nextGroup < totalGroups && !newProgress.unlockedGroups.includes(nextGroup)) {
        newProgress.unlockedGroups.push(nextGroup);
      }

      setProgress(newProgress);
      setGroupScore(score);
      setAppState("groupResult");
    },
    [currentGroupIndex, progress, totalGroups]
  );

  const progressPercent = Math.round(
    ((questionInGroup + 1) / currentGroupQuestions.length) * 100
  );

  // ── Render ──────────────────────────────────────────────────────────────
  if (isLoading) return <LoadingScreen />;

  return (
    <div dir={dir} className="bg-app min-h-screen relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* ── Navbar ── */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl overflow-hidden cursor-pointer flex-shrink-0"
              onClick={() => appState !== "welcome" && setAppState("groupSelect")}
            >
              <img src="/logo.jpeg" alt="BilQuiz Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">BilQuiz</span>
          </div>

          {/* Center — progress during quiz */}
          {appState === "quiz" && (
            <div className="flex items-center gap-3">
              <span className="text-white/40 text-sm hidden sm:block">
                سؤال {questionInGroup + 1} / {currentGroupQuestions.length}
              </span>
              <div className="progress-bar w-28 sm:w-40">
                <motion.div
                  className="progress-fill"
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="glass rounded-full px-3 py-1 flex items-center gap-1.5">
                <span className="text-emerald-400 text-sm font-bold">{groupScore}</span>
                <span className="text-white/30 text-xs">/</span>
                <span className="text-white/40 text-sm">{currentGroupQuestions.length}</span>
              </div>
            </div>
          )}

          {/* Right badge */}
          <div className="badge-ar hidden sm:block">
            {totalGroups} مجموعة
          </div>
        </nav>

        {/* ── Main ── */}
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <AnimatePresence mode="wait">

            {/* WELCOME */}
            {appState === "welcome" && (
              <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full">
                <WelcomeScreen
                  language={language}
                  onStartQuiz={() => setAppState("groupSelect")}
                />
              </motion.div>
            )}

            {/* GROUP SELECT */}
            {appState === "groupSelect" && (
              <motion.div key="groupSelect" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }} className="w-full max-w-2xl">
                <GroupSelect groups={groupInfos} onSelectGroup={startGroup} />
              </motion.div>
            )}

            {/* QUIZ */}
            {appState === "quiz" && currentRiddle && (
              <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full max-w-lg space-y-5">

                {/* Group label + mobile progress */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setAppState("groupSelect")}
                    className="btn-ghost-dark rounded-xl px-3 py-2 text-sm flex items-center gap-1.5"
                  >
                    <span>قائمة المجموعات</span>
                  </button>
                  <span className="badge-ar">المجموعة {currentGroupIndex + 1}</span>
                </div>

                {/* Mobile progress bar */}
                <div className="sm:hidden glass rounded-xl p-3">
                  <div className="flex justify-between text-xs text-white/40 mb-2">
                    <span>سؤال {questionInGroup + 1} من {currentGroupQuestions.length}</span>
                    <span className="text-emerald-400 font-bold">{groupScore} ✓</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div className="progress-fill" animate={{ width: `${progressPercent}%` }} />
                  </div>
                </div>

                {/* QuizCard */}
                <QuizCard
                  riddle={currentRiddle}
                  language={language}
                  onCorrectAnswer={handleCorrectAnswer}
                  onSkip={handleSkip}
                />
              </motion.div>
            )}

            {/* GROUP RESULT */}
            {appState === "groupResult" && (
              <motion.div key="groupResult" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full">
                <GroupResult
                  groupIndex={currentGroupIndex}
                  score={groupScore}
                  total={currentGroupQuestions.length}
                  isLastGroup={currentGroupIndex === totalGroups - 1}
                  dir={dir}
                  onNextGroup={() => startGroup(currentGroupIndex + 1)}
                  onBackToGroups={() => setAppState("groupSelect")}
                  onReplayGroup={() => startGroup(currentGroupIndex)}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* ── Footer ── */}
        <footer className="text-center py-4 text-white/20 text-sm border-t border-white/5">
          BilQuiz © 2024 — {totalGroups} مجموعة • {riddles.length} سؤال
        </footer>
      </div>

      <Toaster />
    </div>
  );
};

export default Index;
