import { useState, useEffect, useCallback } from "react";
import { Progress, GroupSession } from "@/types/game";
import { allGroups, totalGroups, QUESTIONS_PER_GROUP, MIN_SCORE_TO_UNLOCK_GROUP, STORAGE_KEY } from "@/lib/game-config";

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

const loadProgressData = (): Progress => {
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

const saveProgressData = (p: Progress) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {}
};

export const useProgress = () => {
  const [progress, setProgress] = useState<Progress>({ ...DEFAULT_PROGRESS });
  const [hasMounted, setHasMounted] = useState(false);
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState(false);

  useEffect(() => {
    if (!hasMounted) return;
    saveProgressData(progress);
  }, [progress, hasMounted]);

  useEffect(() => {
    const loadedProgress = loadProgressData();
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

    const claimedDate = loadedProgress.lastClaimedDailyRewardDate;
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    if (claimedDate && new Date(claimedDate) < last7Days) {
      loadedProgress.lastClaimedDailyRewardDay = null;
      loadedProgress.lastClaimedDailyRewardDate = null;
    }

    setProgress(loadedProgress);
    setHasMounted(true);

    const claimedToday = loadedProgress.lastClaimedDailyRewardDate === today;
    if (!claimedToday) {
      const t = window.setTimeout(() => setIsDailyRewardOpen(true), 900);
      return () => window.clearTimeout(t);
    }
  }, []);

  const resetProgress = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      setProgress({ ...DEFAULT_PROGRESS });
    } catch {}
  };

  return {
    progress,
    setProgress,
    hasMounted,
    isDailyRewardOpen,
    setIsDailyRewardOpen,
    resetProgress,
    todayStr,
  };
};
