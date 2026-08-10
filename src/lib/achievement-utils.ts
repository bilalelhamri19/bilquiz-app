import { ACHIEVEMENTS, Achievement } from "@/data/achievements";
import { computeTotalStars } from "@/lib/ranks";
import type { AchievementStats, Progress } from "@/types/game";

export const getAchievementStats = (progress: Progress): AchievementStats => ({
  riddlesSolved: progress.riddlesSolved,
  perfectGroups: progress.perfectGroups,
  groupsUnlocked: progress.unlockedGroups.length,
  coinsEarned: progress.totalCoinsEarned,
  streak: progress.streak,
  hintsUsed: progress.hintsUsed,
  totalStars: computeTotalStars(progress),
});

export const getNewAchievements = (
  progress: Progress,
  alreadyUnlocked: Set<string>
): Achievement[] => {
  const stats = getAchievementStats(progress);
  const result: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (alreadyUnlocked.has(achievement.id)) continue;

    let value = 0;
    switch (achievement.type) {
      case "riddles_solved":
        value = stats.riddlesSolved;
        break;
      case "perfect_groups":
        value = stats.perfectGroups;
        break;
      case "groups_unlocked":
        value = stats.groupsUnlocked;
        break;
      case "coins_earned":
        value = stats.coinsEarned;
        break;
      case "streak":
        value = stats.streak;
        break;
      case "hints_used":
        value = stats.hintsUsed;
        break;
      case "total_stars":
        value = stats.totalStars;
        break;
    }

    if (value >= achievement.goal) result.push(achievement);
  }

  return result;
};

export const unlockNewAchievements = (
  progress: Progress,
  onUnlock: (achievement: Achievement) => void
): Progress => {
  const unlocked = new Set(progress.unlockedAchievements);
  const newAchievements = getNewAchievements(progress, unlocked);

  if (newAchievements.length === 0) return progress;

  const allUnlocked = [...progress.unlockedAchievements];
  for (const achievement of newAchievements) {
    if (!allUnlocked.includes(achievement.id)) {
      allUnlocked.push(achievement.id);
      onUnlock(achievement);
    }
  }

  return { ...progress, unlockedAchievements: allUnlocked };
};
