import { useEffect, useState, useCallback } from "react";
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
  Volume2,
  VolumeX,
  Music,
  Music2,
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
import { riddles } from "@/data/riddles";
import { ui } from "@/data/i18n";
import { ACHIEVEMENTS, Achievement } from "@/data/achievements";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import {
  playCorrect,
  playWrong,
  playWin,
  startBackgroundMusic,
  stopBackgroundMusic,
  setSoundEnabled,
} from "@/lib/audio";

// ─── Config ────────────────────────────────────────────────────────────────
const QUESTIONS_PER_GROUP = 10;
const MIN_SCORE_TO_UNLOCK_GROUP = 6;
const STORAGE_KEY = "bilquiz_progress";
const THEME_STORAGE_KEY = "bilquiz_theme";
const SOUND_STORAGE_KEY = "bilquiz_sound";
const MUSIC_STORAGE_KEY = "bilquiz_music";
const COINS_PER_CORRECT_ANSWER = 5;

// Split riddles into groups of 10
const allGroups = Array.from(
  { length: Math.ceil(riddles.length / QUESTIONS_PER_GROUP) },
  (_, i) => riddles.slice(i * QUESTIONS_PER_GROUP, (i + 1) * QUESTIONS_PER_GROUP)
);

// ─── Types ─────────────────────────────────────────────────────────────────
type AppState = "welcome" | "groupSelect" | "quiz" | "groupResult";

interface Progress {
  unlockedGroups: number[];
  completedGroups: Record<number, number>;
  inProgressGroups: Record<number, GroupSession>;
  coins: number;
  lastGroupIndex: number;
  // Extended stats
  totalCoinsEarned: number;
  riddlesSolved: number;
  hintsUsed: number;
  perfectGroups: number;
  sessionsPlayed: number;
  unlockedAchievements: string[];
  streak: number;
  lastPlayedDate: string | null;
  lastClaimedDailyRewardDay: number | null;
  lastClaimedDailyRewardDate: string | null;
}

interface GroupSession {
  resolvedQuestionIndexes: number[];
  score: number;
  activeQuestionIndex: number;
}

const DEFAULT_PROGRESS: Progress = {
  unlockedGroups: [0],
  completedGroups: {},
  inProgressGroups: {},
  coins: 0,
  lastGroupIndex: 0,
  totalCoinsEarned: 0,
  riddlesSolved: 0,
  hintsUsed: 0,
  perfectGroups: 0,
  sessionsPlayed: 0,
  unlockedAchievements: [],
  streak: 0,
  lastPlayedDate: null,
  lastClaimedDailyRewardDay: null,
  lastClaimedDailyRewardDate: null,
};

const todayStr = () => new Date().toISOString().slice(0, 10);

const isYesterday = (dateStr: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toISOString().slice(0, 10);
};

const loadProgress = (): Progress => {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;

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
            score <= (questionCount ?? QUESTIONS_PER_GROUP)
          );
        })
      ) as Record<number, number>;

      const inProgressGroups = Object.fromEntries(
        Object.entries(saved.inProgressGroups ?? {}).flatMap(([index, session]) => {
          const groupIndex = Number(index);
          const questionCount = allGroups[groupIndex]?.length ?? QUESTIONS_PER_GROUP;
          const resolvedQuestionIndexes = Array.isArray(session?.resolvedQuestionIndexes)
            ? [...new Set(session.resolvedQuestionIndexes)].filter(
                (questionIndex): questionIndex is number =>
                  Number.isInteger(questionIndex) &&
                  questionIndex >= 0 &&
                  questionIndex < questionCount
              )
            : [];

          const isValid =
            Number.isInteger(groupIndex) &&
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
            ? [
                [
                  groupIndex,
                  {
                    resolvedQuestionIndexes,
                    score: session.score,
                    activeQuestionIndex: session.activeQuestionIndex,
                  },
                ],
              ]
            : [];
        })
      ) as Record<number, GroupSession>;

      const unlockedGroups = [0];
      while (completedGroups[unlockedGroups.length - 1] !== undefined) {
        unlockedGroups.push(unlockedGroups.length);
      }

      const safeNum = (x: any, fallback = 0) =>
        typeof x === "number" && Number.isFinite(x) ? Math.max(0, Math.floor(x)) : fallback;

      return {
        unlockedGroups,
        completedGroups,
        inProgressGroups,
        coins: safeNum(saved.coins),
        lastGroupIndex: Math.min(
          Number.isInteger(saved.lastGroupIndex) && saved.lastGroupIndex! >= 0
            ? saved.lastGroupIndex!
            : 0,
          Math.max(0, unlockedGroups.length - 1)
        ),
        totalCoinsEarned: safeNum(saved.totalCoinsEarned),
        riddlesSolved: safeNum(saved.riddlesSolved),
        hintsUsed: safeNum(saved.hintsUsed),
        perfectGroups: safeNum(saved.perfectGroups),
        sessionsPlayed: safeNum(saved.sessionsPlayed),
        unlockedAchievements: Array.isArray(saved.unlockedAchievements)
          ? saved.unlockedAchievements.filter((x): x is string => typeof x === "string")
          : [],
        streak: safeNum(saved.streak),
        lastPlayedDate:
          typeof saved.lastPlayedDate === "string" ? saved.lastPlayedDate : null,
        lastClaimedDailyRewardDay:
          typeof saved.lastClaimedDailyRewardDay === "number"
            ? saved.lastClaimedDailyRewardDay
            : null,
        lastClaimedDailyRewardDate:
          typeof saved.lastClaimedDailyRewardDate === "string"
            ? saved.lastClaimedDailyRewardDate
            : null,
      };
    }
  } catch {}
  return { ...DEFAULT_PROGRESS };
};

const saveProgress = (p: Progress) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {}
};

// ─── Achievement helpers ───────────────────────────────────────────────────
const getAchievementStats = (p: Progress) => ({
  riddlesSolved: p.riddlesSolved,
  perfectGroups: p.perfectGroups,
  groupsUnlocked: p.unlockedGroups.length,
  coinsEarned: p.totalCoinsEarned,
  streak: p.streak,
  hintsUsed: p.hintsUsed,
  totalStars: computeTotalStars(p),
});

const computeTotalStars = (p: Progress): number => {
  let stars = 0;
  for (const score of Object.values(p.completedGroups)) {
    const pct = (score / QUESTIONS_PER_GROUP) * 100;
    if (pct >= 90) stars += 3;
    else if (pct >= 60) stars += 2;
    else if (pct >= 30) stars += 1;
  }
  return stars;
};

const getNewAchievements = (
  current: Progress,
  alreadyUnlocked: Set<string>
): Achievement[] => {
  const stats = getAchievementStats(current);
  const result: Achievement[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (alreadyUnlocked.has(ach.id)) continue;
    let v: number;
    switch (ach.type) {
      case "riddles_solved": v = stats.riddlesSolved; break;
      case "perfect_groups": v = stats.perfectGroups; break;
      case "groups_unlocked": v = stats.groupsUnlocked; break;
      case "coins_earned": v = stats.coinsEarned; break;
      case "streak": v = stats.streak; break;
      case "hints_used": v = stats.hintsUsed; break;
      case "total_stars": v = stats.totalStars; break;
      default: v = 0;
    }
    if (v >= ach.goal) result.push(ach);
  }
  return result;
};

// ─── Rank system ───────────────────────────────────────────────────────────
const RANKS: { title: string; threshold: number }[] = [
  { title: "مبتدئ", threshold: 0 },
  { title: "ذكي", threshold: 15 },
  { title: "محترف", threshold: 50 },
  { title: "عبقري", threshold: 110 },
  { title: "أسطورة الألغاز", threshold: 180 },
];

const getRank = (p: Progress) => {
  const stars = computeTotalStars(p);
  let rankIndex = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (stars >= RANKS[i].threshold) rankIndex = i;
  }
  const current = RANKS[rankIndex];
  const next = RANKS[rankIndex + 1];
  const progressPct = next
    ? Math.max(
        0,
        Math.min(100, Math.round(((stars - current.threshold) / (next.threshold - current.threshold)) * 100))
      )
    : 100;
  return { title: current.title, progress: progressPct };
};

// ─── Component ─────────────────────────────────────────────────────────────
const Index = () => {
  const [appState, setAppState] = useState<AppState>("welcome");
  const [progress, setProgress] = useState<Progress>({ ...DEFAULT_PROGRESS });
  const [hasMounted, setHasMounted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isMusicOn, setIsMusicOn] = useState(false);

  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null);
  const [isAchievementToastOpen, setIsAchievementToastOpen] = useState(false);

  // Current session
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [questionInGroup, setQuestionInGroup] = useState(0);
  const [groupScore, setGroupScore] = useState(0);
  const [resolvedQuestions, setResolvedQuestions] = useState<Set<number>>(new Set());
  const [isQuestionTransitioning, setIsQuestionTransitioning] = useState(false);

  const language: "ar" = "ar";
  const dir = "rtl";
  const t = ui.ar;

  const currentGroupQuestions = allGroups[currentGroupIndex] ?? [];
  const currentRiddle = currentGroupQuestions[questionInGroup];
  const totalGroups = allGroups.length;
  const totalRiddles = allGroups.reduce((sum, g) => sum + g.length, 0);
  const maxStars = totalGroups * 3;

  // ── Persistence ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hasMounted) return;
    saveProgress(progress);
  }, [progress, hasMounted]);

  // ── Mount / initialize preferences ─────────────────────────────────────
  useEffect(() => {
    const loadedProgress = loadProgress();

    // Session counter
    const today = todayStr();
    if (loadedProgress.lastPlayedDate !== today) {
      loadedProgress.sessionsPlayed = Math.max(0, loadedProgress.sessionsPlayed) + 1;

      if (!loadedProgress.lastPlayedDate || isYesterday(loadedProgress.lastPlayedDate)) {
        loadedProgress.streak = Math.max(0, loadedProgress.streak) + 1;
      } else if (loadedProgress.lastPlayedDate !== today) {
        loadedProgress.streak = 1;
      }
      loadedProgress.lastPlayedDate = today;
    }

    // Reset daily reward claim after 7-day cycle (new day resets position)
    const claimedDate = loadedProgress.lastClaimedDailyRewardDate;
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    if (claimedDate && new Date(claimedDate) < last7Days) {
      loadedProgress.lastClaimedDailyRewardDay = null;
      loadedProgress.lastClaimedDailyRewardDate = null;
    }

    setProgress(loadedProgress);

    // Theme
    try {
      const lightMode = localStorage.getItem(THEME_STORAGE_KEY) === "light";
      setIsLightMode(lightMode);
      document.documentElement.classList.toggle("theme-light", lightMode);
    } catch {}

    // Sound + music
    try {
      const savedSound = localStorage.getItem(SOUND_STORAGE_KEY);
      const sound = savedSound === null ? true : savedSound === "on";
      setIsSoundOn(sound);
      setSoundEnabled(sound);
    } catch {}

    try {
      const savedMusic = localStorage.getItem(MUSIC_STORAGE_KEY) === "on";
      setIsMusicOn(savedMusic);
      if (savedMusic) startBackgroundMusic();
    } catch {}

    setHasMounted(true);

    // Open daily rewards if not claimed today
    const claimedToday = loadedProgress.lastClaimedDailyRewardDate === today;
    if (!claimedToday) {
      const t = window.setTimeout(() => setIsDailyRewardOpen(true), 900);
      return () => window.clearTimeout(t);
    }
  }, []);

  // ── Sound toggles ──────────────────────────────────────────────────────
  const toggleSound = () => {
    const next = !isSoundOn;
    setIsSoundOn(next);
    setSoundEnabled(next);
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, next ? "on" : "off");
    } catch {}
  };

  const toggleMusic = () => {
    const next = !isMusicOn;
    setIsMusicOn(next);
    if (next) startBackgroundMusic();
    else stopBackgroundMusic();
    try {
      localStorage.setItem(MUSIC_STORAGE_KEY, next ? "on" : "off");
    } catch {}
  };

  // ── Group info builder ─────────────────────────────────────────────────
  const groupInfos: GroupInfo[] = allGroups.map((grp, i) => ({
    index: i,
    label: t.groupOf(i + 1, totalGroups),
    questionCount: grp.length,
    isUnlocked: progress.unlockedGroups.includes(i),
    isCompleted: i in progress.completedGroups,
    score: progress.completedGroups[i],
  }));

  // ── Achievement unlocker ───────────────────────────────────────────────
  const showAchievement = useCallback((ach: Achievement) => {
    setAchievementToast(ach);
    setIsAchievementToastOpen(true);
    window.setTimeout(() => setIsAchievementToastOpen(false), 4200);
  }, []);

  const checkAndUnlockAchievements = useCallback((updatedProgress: Progress): Progress => {
    const unlocked = new Set(updatedProgress.unlockedAchievements);
    const newAchievements = getNewAchievements(updatedProgress, unlocked);
    if (newAchievements.length === 0) return updatedProgress;
    const allUnlocked = [...updatedProgress.unlockedAchievements];
    for (const ach of newAchievements) {
      if (!allUnlocked.includes(ach.id)) {
        allUnlocked.push(ach.id);
        showAchievement(ach);
      }
    }
    return { ...updatedProgress, unlockedAchievements: allUnlocked };
  }, [showAchievement]);

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
    if (isSoundOn) playCorrect();

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
    if (isSoundOn) playWrong();
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
      if (isSoundOn) playWin();

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
    },
    [currentGroupIndex, totalGroups, isSoundOn, checkAndUnlockAchievements]
  );

  const progressPercent = Math.round(
    (resolvedQuestions.size / currentGroupQuestions.length) * 100
  );

  const resetProgress = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      setProgress({ ...DEFAULT_PROGRESS });
      toast({
        title: "تم مسح التقدم",
        description: "تمت إعادة ضبط البيانات. ألغاز جديدة تنتظرك!",
      });
    } catch {}
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
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl overflow-hidden cursor-pointer flex-shrink-0"
              onClick={() => appState !== "welcome" && setAppState("groupSelect")}
            >
              <Image
                src="/logo.jpeg"
                alt="BilQuiz Logo"
                width={40}
                height={40}
                priority
                className="h-full w-full object-cover"
              />
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
            {/* Sound quick-toggle */}
            <button
              type="button"
              onClick={toggleSound}
              aria-label={isSoundOn ? "إيقاف الصوت" : "تشغيل الصوت"}
              className="btn-ghost-dark h-10 w-10 rounded-xl flex items-center justify-center text-white/70 hover:text-white"
            >
              {isSoundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={isMusicOn ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
              className={`btn-ghost-dark h-10 w-10 rounded-xl flex items-center justify-center hover:text-white ${
                isMusicOn ? "text-violet-300" : "text-white/70"
              }`}
            >
              {isMusicOn ? <Music2 size={18} /> : <Music size={18} />}
            </button>

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

              {/* Sound + Music */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-pressed={isSoundOn}
                  className="w-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-right hover:bg-white/10"
                >
                  <span className="flex items-center gap-3 text-white font-bold">
                    {isSoundOn ? (
                      <Volume2 className="text-emerald-400" />
                    ) : (
                      <VolumeX className="text-white/40" />
                    )}
                    الصوت والمؤثرات
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isSoundOn
                        ? "bg-emerald-400/15 text-emerald-300"
                        : "bg-white/5 text-white/40"
                    }`}
                  >
                    {isSoundOn ? "مفعّل" : "موقوف"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={toggleMusic}
                  aria-pressed={isMusicOn}
                  className="w-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-right hover:bg-white/10"
                >
                  <span className="flex items-center gap-3 text-white font-bold">
                    {isMusicOn ? (
                      <Music2 className="text-violet-400" />
                    ) : (
                      <Music className="text-white/40" />
                    )}
                    الموسيقى الخلفية
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isMusicOn
                        ? "bg-violet-400/15 text-violet-300"
                        : "bg-white/5 text-white/40"
                    }`}
                  >
                    {isMusicOn ? "مفعّلة" : "موقوفة"}
                  </span>
                </button>
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
                  onClick={resetProgress}
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
