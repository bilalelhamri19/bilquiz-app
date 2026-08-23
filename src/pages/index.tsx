import { useEffect, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import Image from "next/image";
import Link from "next/link";
import {
  CircleHelp,
  Gamepad2,
  Info,
  MessageCircle,
  Moon,
  Settings,
  Share2,
  ShieldCheck,
  Sun,
  X,
  Trophy,
  Gift,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeScreen from "@/components/WelcomeScreen";
import QuizCard from "@/components/QuizCard";
import GroupSelect, { GroupInfo } from "@/components/GroupSelect";
import GroupResult from "@/components/GroupResult";
import DailyRewardModal from "@/components/DailyRewardModal";
import AchievementsModal from "@/components/AchievementsModal";
import StatsModal from "@/components/StatsModal";
import AchievementToast from "@/components/AchievementToast";
import { SiteFooter } from "@/components/SiteLayout";
import { riddles, languages, Language } from "@/data/riddles";
import { ui } from "@/data/i18n";
import { ACHIEVEMENTS, Achievement } from "@/data/achievements";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

import { useLanguage } from "@/hooks/game/useLanguage";
import { useProgress } from "@/hooks/game/useProgress";
import { useAchievements } from "@/hooks/game/useAchievements";
import { getRank } from "@/lib/ranks";
import { allGroups, totalGroups, QUESTIONS_PER_GROUP, MIN_SCORE_TO_UNLOCK_GROUP, THEME_STORAGE_KEY, COINS_PER_CORRECT_ANSWER } from "@/lib/game-config";
import { AppState, GroupSession, Progress } from "@/types/game";

// ─── Component ─────────────────────────────────────────────────────────────
const Index = () => {
  const [appState, setAppState] = useState<AppState>("welcome");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  const {
    progress,
    setProgress,
    hasMounted,
    isDailyRewardOpen,
    setIsDailyRewardOpen,
    resetProgress: hookResetProgress,
    todayStr,
  } = useProgress();

  const { language, changeLanguage, dir, t } = useLanguage();

  const {
    achievementToast,
    isAchievementToastOpen,
    setIsAchievementToastOpen,
    checkAndUnlockAchievements,
    getAchievementStats,
  } = useAchievements();

  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Current session
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [questionInGroup, setQuestionInGroup] = useState(0);
  const [groupScore, setGroupScore] = useState(0);
  const [resolvedQuestions, setResolvedQuestions] = useState<Set<number>>(new Set());
  const [isQuestionTransitioning, setIsQuestionTransitioning] = useState(false);

  const currentGroupQuestions = allGroups[currentGroupIndex] ?? [];
  const currentRiddle = currentGroupQuestions[questionInGroup];
  const maxStars = totalGroups * 3;
  const totalRiddles = allGroups.reduce((sum, g) => sum + g.length, 0);

  // ── Mount / initialize preferences ─────────────────────────────────────
  useEffect(() => {
    try {
      const lightMode = localStorage.getItem(THEME_STORAGE_KEY) === "light";
      setIsLightMode(lightMode);
      document.documentElement.classList.toggle("theme-light", lightMode);
    } catch {}
  }, []);

  // ── Group info builder ─────────────────────────────────────────────────
  const groupInfos: GroupInfo[] = allGroups.map((grp, i) => ({
    index: i,
    label: t.groupOf(i + 1, totalGroups),
    questionCount: grp.length,
    isUnlocked: progress.unlockedGroups.includes(i),
    isCompleted: i in progress.completedGroups,
    score: progress.completedGroups[i],
  }));


  // ── Daily reward claimer ───────────────────────────────────────────────
  const claimDailyReward = (coins: number, day: number) => {
    setProgress((current) => {
      const withReward = {
        ...current,
        coins: current.coins + coins,
        totalCoinsEarned: current.totalCoinsEarned + coins,
        lastClaimedDailyRewardDay: day,
        lastClaimedDailyRewardDate: todayStr(),
      };
      return checkAndUnlockAchievements(withReward);
    });
    toast({
      title: `🎉 مكافأة اليوم!`,
      description: `تم إضافة ${coins} قطعة ذهب إلى رصيدك.`,
    });
    setIsDailyRewardOpen(false);
  };

  // ── Handlers ───────────────────────────────────────────────────────────
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

      const firstSolveThisAttempt = !(currentGroupIndex in current.completedGroups);
      const coinsGained = firstSolveThisAttempt ? COINS_PER_CORRECT_ANSWER : 0;

      const withBasics: Progress = {
        ...current,
        unlockedGroups,
        coins: current.coins + coinsGained,
        totalCoinsEarned: current.totalCoinsEarned + coinsGained,
        riddlesSolved: current.riddlesSolved + 1,
        lastGroupIndex: unlockedGroups.includes(nextGroup) ? nextGroup : current.lastGroupIndex,
      };

      return checkAndUnlockAchievements(withBasics);
    });

    if (unlocksNextGroup) {
      toast({
        title: "تم فتح المجموعة التالية! 🎉",
        description: `وصلت إلى ${MIN_SCORE_TO_UNLOCK_GROUP} إجابات صحيحة. يمكنك إكمال المجموعة الحالية أو الانتقال للمجموعة ${nextGroup + 1}.`,
      });
    }
    resolveQuestion(newScore, questionIndex);
  };

  const spendCoins = (amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    setProgress((current) => {
      if (current.coins < amount) return current;
      return {
        ...current,
        coins: current.coins - amount,
        hintsUsed: current.hintsUsed + 1,
      };
    });
  };

  const toggleTheme = () => {
    const nextMode = !isLightMode;
    setIsLightMode(nextMode);
    document.documentElement.classList.toggle("theme-light", nextMode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextMode ? "light" : "dark");
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
    } catch {}
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

    const nextQuestionIndex =
      (resolvedIndex + 1 + nextQuestion) % currentGroupQuestions.length;
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

        const isPerfect = score >= QUESTIONS_PER_GROUP;
        const previousBest = current.completedGroups[currentGroupIndex] ?? 0;
        const newBest =
          score >= MIN_SCORE_TO_UNLOCK_GROUP ? Math.max(score, previousBest) : previousBest;
        const perfectGroupsDelta =
          isPerfect && previousBest < QUESTIONS_PER_GROUP ? 1 : 0;

        const unlockedGroups = [...current.unlockedGroups];
        const nextGroup = currentGroupIndex + 1;
        if (
          score >= MIN_SCORE_TO_UNLOCK_GROUP &&
          nextGroup < totalGroups &&
          !unlockedGroups.includes(nextGroup)
        ) {
          unlockedGroups.push(nextGroup);
        }

        const newProgress: Progress = {
          ...current,
          unlockedGroups,
          inProgressGroups,
          perfectGroups: current.perfectGroups + perfectGroupsDelta,
          completedGroups:
            score >= MIN_SCORE_TO_UNLOCK_GROUP
              ? { ...current.completedGroups, [currentGroupIndex]: newBest }
              : current.completedGroups,
          lastGroupIndex:
            score >= MIN_SCORE_TO_UNLOCK_GROUP && nextGroup < totalGroups
              ? nextGroup
              : currentGroupIndex,
        };

        return checkAndUnlockAchievements(newProgress);
      });
      setGroupScore(score);
      setAppState("groupResult");

      if (score >= MIN_SCORE_TO_UNLOCK_GROUP) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#34d399', '#fbbf24', '#818cf8']
        });
      }
    },
    [currentGroupIndex, checkAndUnlockAchievements, setProgress]
  );

  const progressPercent = Math.round(
    (resolvedQuestions.size / currentGroupQuestions.length) * 100
  );

  const handleResetProgress = () => {
    hookResetProgress();
    toast({
      title: "تم مسح التقدم",
      description: "تمت إعادة ضبط البيانات. ألغاز جديدة تنتظرك!",
    });
    setIsSettingsOpen(false);
  };

  const rank = getRank(progress);
  const achievementStats = getAchievementStats(progress);

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
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setAppState("welcome")}
            title="العودة إلى الشاشة الرئيسية"
          >
            <div className="h-10 w-10 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/logo.jpeg"
                alt="BilQuiz Logo"
                width={40}
                height={40}
                priority
                className="h-full w-full object-cover"
              />
            </div>
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
              <div
                dir="ltr"
                className="glass rounded-full px-3 py-1 flex items-center gap-1.5"
              >
                <span className="text-emerald-400 text-sm font-bold">{groupScore}</span>
                <span className="text-white/30 text-xs">/</span>
                <span className="text-white/40 text-sm">{currentGroupQuestions.length}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
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
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <WelcomeScreen
                  onStartQuiz={() => setAppState("groupSelect")}
                  coins={progress.coins}
                  completedGroupsCount={Object.keys(progress.completedGroups).length}
                  totalGroupsCount={totalGroups}
                  rankTitle={rank.title}
                  totalStars={achievementStats.totalStars}
                  maxStars={maxStars}
                />
                {/* Quick actions under welcome */}
                <div className="mt-6 mx-auto max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDailyRewardOpen(true)}
                    className="glass rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1 hover:bg-white/10 transition"
                  >
                    <Gift size={20} className="text-amber-400" />
                    <span className="text-xs font-black text-white">المكافآت اليومية</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAchievementsOpen(true)}
                    className="glass rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1 hover:bg-white/10 transition"
                  >
                    <Trophy size={20} className="text-violet-400" />
                    <span className="text-xs font-black text-white">الإنجازات</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsStatsOpen(true)}
                    className="glass rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1 hover:bg-white/10 transition"
                  >
                    <BarChart3 size={20} className="text-cyan-400" />
                    <span className="text-xs font-black text-white">الإحصائيات</span>
                  </button>
                  <button
                    type="button"
                    onClick={shareGame}
                    className="glass rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1 hover:bg-white/10 transition"
                  >
                    <Share2 size={20} className="text-emerald-400" />
                    <span className="text-xs font-black text-white">شارك اللعبة</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* GROUP SELECT */}
            {appState === "groupSelect" && (
              <motion.div
                key="groupSelect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-2xl"
              >
                <GroupSelect groups={groupInfos} onSelectGroup={startGroup} />
              </motion.div>
            )}

            {/* QUIZ */}
            {appState === "quiz" && currentRiddle && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-lg space-y-5"
              >
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
                    <span>
                      سؤال <bdi dir="ltr">{questionInGroup + 1} / {currentGroupQuestions.length}</bdi>
                    </span>
                    <span dir="ltr" className="text-emerald-400 font-bold">
                      {groupScore} ✓
                    </span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      animate={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Question list for the active group */}
                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-bold text-sm">أسئلة المجموعة</span>
                    <span className="text-white/40 text-xs">
                      {currentGroupQuestions.length} أسئلة
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {currentGroupQuestions.map((_, index) => {
                      const isCurrentQuestion = index === questionInGroup;
                      const isResolved = resolvedQuestions.has(index);
                      return (
                        <button
                          type="button"
                          key={index}
                          onClick={() =>
                            !isQuestionTransitioning && setQuestionInGroup(index)
                          }
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
                  coins={progress.coins}
                  onSpendCoins={spendCoins}
                  onCorrectAnswer={() => handleCorrectAnswer(questionInGroup)}
                  onSkip={() => handleSkip(questionInGroup)}
                  onBackToGroups={() => setAppState("groupSelect")}
                  onAnswerPendingChange={setIsQuestionTransitioning}
                />
              </motion.div>
            )}

            {/* GROUP RESULT */}
            {appState === "groupResult" && (
              <motion.div
                key="groupResult"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
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
        <SiteFooter />
      </div>

      {/* ── Settings Drawer ── */}
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
              className="glass h-full w-full max-w-[280px] overflow-y-auto rounded-l-3xl border border-white/10 p-6 shadow-2xl"
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
                <h2
                  id="settings-title"
                  className="text-xl font-black text-white flex items-center gap-2"
                >
                  <Settings size={20} className="text-emerald-400" /> الإعدادات
                </h2>
              </div>

              {/* Theme */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-pressed={isLightMode}
                className="mt-2 w-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-right hover:bg-white/10"
              >
                <span className="flex items-center gap-3 text-white font-bold">
                  {isLightMode ? (
                    <Sun className="text-amber-400" />
                  ) : (
                    <Moon className="text-violet-300" />
                  )}
                  {isLightMode ? "الوضع النهاري" : "الوضع الليلي"}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    isLightMode
                      ? "bg-amber-400/35 text-amber-800"
                      : "bg-violet-400/15 text-violet-300"
                  }`}
                >
                  مفعّل
                </span>
              </button>



              {/* Quick Modals */}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsDailyRewardOpen(true);
                  }}
                  className="rounded-xl p-3 text-center border border-amber-400/20 bg-amber-400/5 hover:bg-amber-400/10 transition"
                >
                  <Gift size={20} className="text-amber-400 mx-auto" />
                  <span className="block mt-1 text-xs font-black text-white">المكافآت</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsAchievementsOpen(true);
                  }}
                  className="rounded-xl p-3 text-center border border-violet-400/20 bg-violet-400/5 hover:bg-violet-400/10 transition"
                >
                  <Trophy size={20} className="text-violet-400 mx-auto" />
                  <span className="block mt-1 text-xs font-black text-white">الإنجازات</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsStatsOpen(true);
                  }}
                  className="rounded-xl p-3 text-center border border-cyan-400/20 bg-cyan-400/5 hover:bg-cyan-400/10 transition"
                >
                  <BarChart3 size={20} className="text-cyan-400 mx-auto" />
                  <span className="block mt-1 text-xs font-black text-white">الإحصائيات</span>
                </button>
                <button
                  type="button"
                  onClick={shareGame}
                  className="rounded-xl p-3 text-center border border-emerald-400/20 bg-emerald-400/5 hover:bg-emerald-400/10 transition"
                >
                  <Share2 size={20} className="text-emerald-400 mx-auto" />
                  <span className="block mt-1 text-xs font-black text-white">مشاركة</span>
                </button>
              </div>

              {/* Nav links */}
              <nav
                aria-label="روابط BilQuiz"
                className="mt-5 flex flex-col gap-2 text-sm font-bold"
              >
                <Link
                  href="/how-to-play"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-white/65 transition-colors hover:bg-white/5 hover:text-emerald-300"
                >
                  <Gamepad2 size={18} /> كيف تلعب
                </Link>
                <Link
                  href="/blog"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-white/65 transition-colors hover:bg-white/5 hover:text-emerald-300"
                >
                  <Info size={18} /> المدونة
                </Link>
                <Link
                  href="/faq"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-white/65 transition-colors hover:bg-white/5 hover:text-emerald-300"
                >
                  <CircleHelp size={18} /> الأسئلة الشائعة
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-white/65 transition-colors hover:bg-white/5 hover:text-emerald-300"
                >
                  <Info size={18} /> من نحن
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-white/65 transition-colors hover:bg-white/5 hover:text-emerald-300"
                >
                  <MessageCircle size={18} /> تواصل معنا
                </Link>
                <Link
                  href="/privacy"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-white/65 transition-colors hover:bg-white/5 hover:text-emerald-300"
                >
                  <ShieldCheck size={18} /> سياسة الخصوصية
                </Link>
              </nav>

              {/* Danger zone */}
              <div className="mt-8 border-t border-white/10 pt-5 space-y-2">
                <button
                  type="button"
                  onClick={handleResetProgress}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-300 px-4 py-3 font-black text-sm transition"
                >
                  <RefreshCw size={16} /> إعادة ضبط التقدم
                </button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modals ── */}
      <DailyRewardModal
        open={isDailyRewardOpen}
        streak={progress.streak}
        lastClaimedDay={progress.lastClaimedDailyRewardDay}
        onClaim={claimDailyReward}
        onClose={() => setIsDailyRewardOpen(false)}
      />
      <AchievementsModal
        open={isAchievementsOpen}
        progress={progress.unlockedAchievements.length}
        unlockedIds={progress.unlockedAchievements}
        stats={achievementStats}
        onClose={() => setIsAchievementsOpen(false)}
      />
      <StatsModal
        open={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={{
          riddlesSolved: progress.riddlesSolved,
          totalRiddles,
          groupsUnlocked: progress.unlockedGroups.length,
          totalGroups,
          totalStars: achievementStats.totalStars,
          maxStars,
          totalCoinsEarned: progress.totalCoinsEarned,
          currentCoins: progress.coins,
          hintsUsed: progress.hintsUsed,
          perfectGroups: progress.perfectGroups,
          sessionsPlayed: progress.sessionsPlayed,
          streak: progress.streak,
          rankTitle: rank.title,
          rankProgress: rank.progress,
        }}
      />

      <AchievementToast
        open={isAchievementToastOpen}
        achievement={
          achievementToast
            ? {
                icon: achievementToast.icon,
                title: achievementToast.title,
                description: achievementToast.description,
              }
            : null
        }
        onClose={() => setIsAchievementToastOpen(false)}
      />

      <Toaster />
    </div>
  );
};

export default Index;
