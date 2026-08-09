
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Settings, Share2, Volume2, VolumeX, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeScreen from "@/components/WelcomeScreen";
import QuizCard from "@/components/QuizCard";
import GroupSelect, { GroupInfo } from "@/components/GroupSelect";
import GroupResult from "@/components/GroupResult";
import { riddles, Language } from "@/data/riddles";
import { ui } from "@/data/i18n";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { setSoundEnabled, startBackgroundMusic, stopBackgroundMusic } from "@/lib/audio";

// ─── Config ────────────────────────────────────────────────────────────────
const QUESTIONS_PER_GROUP = 10;
const MIN_SCORE_TO_UNLOCK_GROUP = 6;
const STORAGE_KEY = "bilquiz_progress";
const SOUND_STORAGE_KEY = "bilquiz_sound_enabled";
const COINS_PER_CORRECT_ANSWER = 5;

// Split riddles into groups of 8
const allGroups = Array.from(
  { length: Math.ceil(riddles.length / QUESTIONS_PER_GROUP) },
  (_, i) => riddles.slice(i * QUESTIONS_PER_GROUP, (i + 1) * QUESTIONS_PER_GROUP)
);

// ─── Types ─────────────────────────────────────────────────────────────────
type AppState = "welcome" | "groupSelect" | "quiz" | "groupResult";

interface Progress {
  unlockedGroups: number[];            // group indices that are unlocked
  completedGroups: Record<number, number>; // groupIndex → best score
  inProgressGroups: Record<number, GroupSession>;
  coins: number;
  lastGroupIndex: number;
}

interface GroupSession {
  resolvedQuestionIndexes: number[];
  score: number;
  activeQuestionIndex: number;
}

const loadProgress = (): Progress => {
  if (typeof window === "undefined") {
    return { unlockedGroups: [0], completedGroups: {}, inProgressGroups: {}, coins: 0, lastGroupIndex: 0 };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<Progress>;
      const completedGroups = Object.fromEntries(
        Object.entries(saved.completedGroups ?? {}).filter(([index, score]) => {
          const groupIndex = Number(index);
          const questionCount = allGroups[groupIndex]?.length;
          return (
            Number.isInteger(groupIndex) &&
            typeof score === "number" &&
            Number.isInteger(score) &&
            score >= MIN_SCORE_TO_UNLOCK_GROUP &&
            score <= questionCount
          );
        })
      ) as Record<number, number>;

      const inProgressGroups = Object.fromEntries(
        Object.entries(saved.inProgressGroups ?? {}).flatMap(([index, session]) => {
          const groupIndex = Number(index);
          const questionCount = allGroups[groupIndex]?.length;
          const resolvedQuestionIndexes = Array.isArray(session?.resolvedQuestionIndexes)
            ? [...new Set(session.resolvedQuestionIndexes)].filter(
                (questionIndex): questionIndex is number =>
                  Number.isInteger(questionIndex) && questionIndex >= 0 && questionIndex < questionCount
              )
            : [];

          const isValid =
            Number.isInteger(groupIndex) &&
            questionCount !== undefined &&
            resolvedQuestionIndexes.length > 0 &&
            resolvedQuestionIndexes.length < questionCount &&
            typeof session?.score === "number" &&
            Number.isInteger(session.score) &&
            session.score >= 0 &&
            session.score <= resolvedQuestionIndexes.length &&
            Number.isInteger(session.activeQuestionIndex) &&
            session.activeQuestionIndex >= 0 &&
            session.activeQuestionIndex < questionCount &&
            !resolvedQuestionIndexes.includes(session.activeQuestionIndex);

          return isValid
            ? [[groupIndex, { resolvedQuestionIndexes, score: session.score, activeQuestionIndex: session.activeQuestionIndex }]]
            : [];
        })
      ) as Record<number, GroupSession>;

      // Rebuild unlocks from passed groups so progress created before the
      // six-correct-answer rule cannot keep later groups unlocked.
      const unlockedGroups = [0];
      while (completedGroups[unlockedGroups.length - 1] !== undefined) {
        unlockedGroups.push(unlockedGroups.length);
      }

      return {
        unlockedGroups,
        completedGroups,
        inProgressGroups,
        coins:
          typeof saved.coins === "number" && Number.isFinite(saved.coins)
            ? Math.max(0, Math.floor(saved.coins))
            : 0,
        lastGroupIndex: Math.min(
          typeof saved.lastGroupIndex === "number" && Number.isInteger(saved.lastGroupIndex)
            ? Math.max(0, saved.lastGroupIndex)
            : 0,
          unlockedGroups.length - 1
        ),
      };
    }
  } catch {}
  return { unlockedGroups: [0], completedGroups: {}, inProgressGroups: {}, coins: 0, lastGroupIndex: 0 };
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
  const [progress, setProgress] = useState<Progress>({ unlockedGroups: [0], completedGroups: {}, inProgressGroups: {}, coins: 0, lastGroupIndex: 0 });
  const [hasMounted, setHasMounted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(true);

  // Current session
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [questionInGroup, setQuestionInGroup] = useState(0);
  const [groupScore, setGroupScore] = useState(0);
  const [resolvedQuestions, setResolvedQuestions] = useState<Set<number>>(new Set());
  const [isQuestionTransitioning, setIsQuestionTransitioning] = useState(false);

  const dir = "rtl";
  const language: Language = "ar";

  const t = ui[language];

  const currentGroupQuestions = allGroups[currentGroupIndex] ?? [];
  const currentRiddle = currentGroupQuestions[questionInGroup];
  const totalGroups = allGroups.length;

  useEffect(() => {
    if (!hasMounted) return;
    saveProgress(progress);
  }, [progress, hasMounted]);

  useEffect(() => {
    setProgress(loadProgress());
    try {
      const savedSoundSetting = localStorage.getItem(SOUND_STORAGE_KEY);
      const enabled = savedSoundSetting !== "false";
      setSoundEnabledState(enabled);
      setSoundEnabled(enabled);
    } catch {}
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    if (!soundEnabled) {
      stopBackgroundMusic();
    }
  }, [hasMounted, soundEnabled]);

  useEffect(() => {
    return stopBackgroundMusic;
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
    const groupQuestions = allGroups[groupIndex] ?? [];
    const savedSession = progress.inProgressGroups[groupIndex];
    const resolvedQuestionIndexes = new Set(savedSession?.resolvedQuestionIndexes ?? []);
    const nextQuestionIndex = savedSession
      ? savedSession.activeQuestionIndex
      : groupQuestions.findIndex((_, index) => !resolvedQuestionIndexes.has(index));

    setCurrentGroupIndex(groupIndex);
    setQuestionInGroup(nextQuestionIndex >= 0 ? nextQuestionIndex : 0);
    setGroupScore(savedSession?.score ?? 0);
    setResolvedQuestions(resolvedQuestionIndexes);
    setIsQuestionTransitioning(false);
    setProgress((current) => ({ ...current, lastGroupIndex: groupIndex }));
    // Start audio directly from the player's click so browsers allow playback.
    startBackgroundMusic();
    setAppState("quiz");
  };

  const handleCorrectAnswer = (questionIndex: number) => {
    const newScore = groupScore + 1;
    const nextGroup = currentGroupIndex + 1;
    const unlocksNextGroup =
      newScore === MIN_SCORE_TO_UNLOCK_GROUP &&
      nextGroup < totalGroups &&
      !progress.unlockedGroups.includes(nextGroup);

    setGroupScore(newScore);
    setProgress((current) => {
      const unlockedGroups = [...current.unlockedGroups];
      if (
        newScore >= MIN_SCORE_TO_UNLOCK_GROUP &&
        nextGroup < totalGroups &&
        !unlockedGroups.includes(nextGroup)
      ) {
        unlockedGroups.push(nextGroup);
      }

      return {
        ...current,
        unlockedGroups,
        coins:
          currentGroupIndex in current.completedGroups
            ? current.coins
            : current.coins + COINS_PER_CORRECT_ANSWER,
        lastGroupIndex: unlockedGroups.includes(nextGroup) ? nextGroup : current.lastGroupIndex,
      };
    });

    if (unlocksNextGroup) {
      toast({
        title: "تم فتح المجموعة التالية! 🎉",
        description: `وصلت إلى ${MIN_SCORE_TO_UNLOCK_GROUP} أجوبة صحيحة. يمكنك إكمال المجموعة الحالية أو الانتقال للمجموعة ${nextGroup + 1}.`,
      });
    }
    resolveQuestion(newScore, questionIndex);
  };

  const spendCoins = (amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    setProgress((current) => ({
      ...current,
      coins: current.coins >= amount ? current.coins - amount : current.coins,
    }));
  };

  const toggleSound = () => {
    const nextValue = !soundEnabled;
    setSoundEnabledState(nextValue);
    setSoundEnabled(nextValue);
    if (nextValue) startBackgroundMusic();
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, String(nextValue));
    } catch {}
  };

  const shareGame = async () => {
    const shareData = {
      title: "BilQuiz",
      text: "تحداك تجاوب على ألغاز BilQuiz!",
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
      toast({ title: "تم نسخ رابط اللعبة", description: "شاركه مع أصدقائك وتحداهم!" });
    } catch {
      // The player may close the native share dialog; no feedback is needed.
    }
  };

  const handleSkip = (questionIndex: number) => {
    resolveQuestion(groupScore, questionIndex);
  };

  const resolveQuestion = (score: number, resolvedIndex: number) => {
    if (
      resolvedQuestions.has(resolvedIndex) ||
      resolvedIndex < 0 ||
      resolvedIndex >= currentGroupQuestions.length
    ) {
      return;
    }

    const nextResolvedQuestions = new Set(resolvedQuestions);
    nextResolvedQuestions.add(resolvedIndex);
    setResolvedQuestions(nextResolvedQuestions);

    const nextQuestion = currentGroupQuestions.findIndex((_, offset) => {
      const index = (resolvedIndex + 1 + offset) % currentGroupQuestions.length;
      return !nextResolvedQuestions.has(index);
    });

    if (nextQuestion === -1) {
      completeGroup(score);
      return;
    }

    const nextQuestionIndex = (resolvedIndex + 1 + nextQuestion) % currentGroupQuestions.length;
    setQuestionInGroup(nextQuestionIndex);
    setProgress((current) => ({
      ...current,
      inProgressGroups: {
        ...current.inProgressGroups,
        [currentGroupIndex]: {
          resolvedQuestionIndexes: Array.from(nextResolvedQuestions),
          score,
          activeQuestionIndex: nextQuestionIndex,
        },
      },
    }));
  };

  const completeGroup = useCallback(
    (score: number) => {
      setProgress((current) => {
        const inProgressGroups = Object.fromEntries(
          Object.entries(current.inProgressGroups).filter(
            ([index]) => Number(index) !== currentGroupIndex
          )
        ) as Record<number, GroupSession>;
        const newProgress: Progress = {
          ...current,
          unlockedGroups: [...current.unlockedGroups],
          inProgressGroups,
          completedGroups:
            score >= MIN_SCORE_TO_UNLOCK_GROUP
              ? {
                  ...current.completedGroups,
                  [currentGroupIndex]: Math.max(
                    score,
                    current.completedGroups[currentGroupIndex] ?? 0
                  ),
                }
              : current.completedGroups,
        };

        // Unlock next group if it exists and isn't already unlocked
        const nextGroup = currentGroupIndex + 1;
        if (
          score >= MIN_SCORE_TO_UNLOCK_GROUP &&
          nextGroup < totalGroups &&
          !newProgress.unlockedGroups.includes(nextGroup)
        ) {
          newProgress.unlockedGroups.push(nextGroup);
        }
        newProgress.lastGroupIndex =
          score >= MIN_SCORE_TO_UNLOCK_GROUP && nextGroup < totalGroups
            ? nextGroup
            : currentGroupIndex;

        return newProgress;
      });
      setGroupScore(score);
      setAppState("groupResult");
    },
    [currentGroupIndex, totalGroups]
  );

  const progressPercent = Math.round(
    (resolvedQuestions.size / currentGroupQuestions.length) * 100
  );

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div dir={dir} className="bg-app min-h-screen relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* ── Navbar ── */}
        <nav className="flex items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4 border-b border-white/5">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl overflow-hidden cursor-pointer flex-shrink-0"
              onClick={() => appState !== "welcome" && setAppState("groupSelect")}
            >
              <Image src="/logo.jpeg" alt="BilQuiz Logo" width={40} height={40} priority className="h-full w-full object-cover" />
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">BilQuiz</span>
          </div>

          {/* Center — progress during quiz */}
          {appState === "quiz" && (
            <div className="flex items-center gap-3">
              <span className="text-white/40 text-sm hidden sm:block">
                سؤال <bdi dir="ltr">{questionInGroup + 1} / {currentGroupQuestions.length}</bdi>
              </span>
              <div className="progress-bar w-20 xs:w-28 sm:w-40">
                <motion.div
                  className="progress-fill"
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div dir="ltr" className="glass rounded-full px-3 py-1 flex items-center gap-1.5">
                <span className="text-emerald-400 text-sm font-bold">{groupScore}</span>
                <span className="text-white/30 text-xs">/</span>
                <span className="text-white/40 text-sm">{currentGroupQuestions.length}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {appState !== "welcome" && (
              <button
                type="button"
                onClick={() => setAppState("groupSelect")}
                aria-label="الرجوع إلى المجموعات"
                title="الرجوع إلى المجموعات"
                className="btn-ghost-dark h-10 w-10 rounded-xl flex items-center justify-center text-white/70 hover:text-white"
              >
                <ArrowRight size={20} />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                startBackgroundMusic();
                setIsSettingsOpen(true);
              }}
              aria-label="الإعدادات"
              className="btn-ghost-dark h-10 w-10 rounded-xl flex items-center justify-center text-white/70 hover:text-white"
            >
              <Settings size={20} />
            </button>
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
                  onStartQuiz={() => {
                    startBackgroundMusic();
                    setAppState("groupSelect");
                  }}
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
                    <span>سؤال <bdi dir="ltr">{questionInGroup + 1} / {currentGroupQuestions.length}</bdi></span>
                    <span dir="ltr" className="text-emerald-400 font-bold">{groupScore} ✓</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div className="progress-fill" animate={{ width: `${progressPercent}%` }} />
                  </div>
                </div>

                {/* Question list for the active group */}
                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-bold text-sm">أسئلة المجموعة</span>
                    <span className="text-white/40 text-xs">{currentGroupQuestions.length} أسئلة</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {currentGroupQuestions.map((_, index) => {
                      const isCurrentQuestion = index === questionInGroup;
                      const isResolved = resolvedQuestions.has(index);

                      return (
                        <button
                          type="button"
                          key={index}
                          onClick={() => !isQuestionTransitioning && setQuestionInGroup(index)}
                          disabled={isResolved || isQuestionTransitioning}
                          aria-current={isCurrentQuestion ? "step" : undefined}
                          aria-label={`السؤال ${index + 1}`}
                          className={`rounded-lg py-2 text-center text-sm font-bold transition-colors ${
                            isCurrentQuestion
                              ? "bg-emerald-500 text-slate-950"
                              : isResolved
                              ? "bg-violet-500/20 text-violet-300"
                              : "bg-white/5 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* QuizCard */}
                <QuizCard
                  riddle={currentRiddle}
                  language={language}
                  coins={progress.coins}
                  onSpendCoins={spendCoins}
                  onCorrectAnswer={() => handleCorrectAnswer(questionInGroup)}
                  onSkip={() => handleSkip(questionInGroup)}
                  onAnswerPendingChange={setIsQuestionTransitioning}
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
                  canUnlockNextGroup={groupScore >= MIN_SCORE_TO_UNLOCK_GROUP}
                  requiredScoreToUnlock={MIN_SCORE_TO_UNLOCK_GROUP}
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
        <footer className="text-center px-4 py-5 text-sm border-t border-white/5">
          <div>BilQuiz © 2024 — {totalGroups} مجموعة • {riddles.length} سؤال</div>
        </footer>
      </div>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.section
              dir="rtl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.2 }}
              className="glass h-full w-full max-w-sm overflow-y-auto rounded-l-3xl border border-white/10 p-6 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="settings-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  aria-label="إغلاق الإعدادات"
                  className="text-white/50 hover:text-white"
                >
                  <X size={22} />
                </button>
                <h2 id="settings-title" className="text-xl font-black text-white flex items-center gap-2">
                  <Settings size={20} className="text-emerald-400" /> الإعدادات
                </h2>
              </div>

              <button
                type="button"
                onClick={toggleSound}
                className="w-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-right hover:bg-white/10"
              >
                <span className="flex items-center gap-3 text-white font-bold">
                  {soundEnabled ? <Volume2 className="text-emerald-400" /> : <VolumeX className="text-white/40" />}
                  أصوات اللعبة
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${soundEnabled ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/40"}`}>
                  {soundEnabled ? "مفعلة" : "متوقفة"}
                </span>
              </button>

              <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm text-white/50 leading-relaxed">
                <p className="font-bold text-white/70 mb-2">قواعد اللعب</p>
                <p>خصك 6 أجوبة صحيحة من 10 باش تحل المجموعة التالية.</p>
                <p>كل جواب صحيح كيعطيك 5 coins، والتلميح كيكلف 10 coins.</p>
              </div>

              <nav aria-label="روابط BilQuiz" className="mt-4 flex flex-col gap-2 text-sm font-bold">
                <button type="button" onClick={shareGame} className="flex items-center gap-2 rounded-xl px-3 py-2 text-right text-white/65 transition-colors hover:bg-white/5 hover:text-emerald-300">
                  <Share2 size={18} /> مشاركة اللعبة
                </button>
                <Link href="/how-to-play" className="rounded-xl px-3 py-2 text-white/65 transition-colors hover:bg-white/5 hover:text-emerald-300">كيف تلعب</Link>
                <Link href="/faq" className="rounded-xl px-3 py-2 text-white/65 transition-colors hover:bg-white/5 hover:text-emerald-300">الأسئلة الشائعة</Link>
                <Link href="/about" className="rounded-xl px-3 py-2 text-white/65 transition-colors hover:bg-white/5 hover:text-emerald-300">من نحن</Link>
                <Link href="/contact" className="rounded-xl px-3 py-2 text-white/65 transition-colors hover:bg-white/5 hover:text-emerald-300">تواصل معنا</Link>
                <Link href="/privacy" className="rounded-xl px-3 py-2 text-white/65 transition-colors hover:bg-white/5 hover:text-emerald-300">سياسة الخصوصية</Link>
              </nav>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster />
    </div>
  );
};

export default Index;
