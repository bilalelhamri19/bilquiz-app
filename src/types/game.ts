export type AppState = "welcome" | "groupSelect" | "quiz" | "groupResult";

export interface GroupSession {
  resolvedQuestionIndexes: number[];
  score: number;
  activeQuestionIndex: number;
}

export interface Progress {
  unlockedGroups: number[];
  completedGroups: Record<number, number>;
  inProgressGroups: Record<number, GroupSession>;
  coins: number;
  lastGroupIndex: number;
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

export interface RankInfo {
  title: string;
  progress: number;
}

export interface AchievementStats {
  riddlesSolved: number;
  perfectGroups: number;
  groupsUnlocked: number;
  coinsEarned: number;
  streak: number;
  hintsUsed: number;
  totalStars: number;
}
