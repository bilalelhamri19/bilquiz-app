import { useState, useCallback } from "react";
import { Achievement, ACHIEVEMENTS } from "@/data/achievements";
import { Progress } from "@/types/game";
import { computeTotalStars } from "@/lib/ranks";

const getAchievementStats = (p: Progress) => ({
  riddlesSolved: p.riddlesSolved,
  perfectGroups: p.perfectGroups,
  groupsUnlocked: p.unlockedGroups.length,
  coinsEarned: p.totalCoinsEarned,
  streak: p.streak,
  hintsUsed: p.hintsUsed,
  totalStars: computeTotalStars(p),
});

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

export const useAchievements = () => {
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null);
  const [isAchievementToastOpen, setIsAchievementToastOpen] = useState(false);

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

  return {
    achievementToast,
    isAchievementToastOpen,
    setIsAchievementToastOpen,
    checkAndUnlockAchievements,
    getAchievementStats,
  };
};
