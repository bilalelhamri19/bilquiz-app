import { QUESTIONS_PER_GROUP } from "@/lib/game-config";
import type { Progress, RankInfo } from "@/types/game";

const RANKS: { title: string; threshold: number }[] = [
  { title: "مبتدئ", threshold: 0 },
  { title: "ذكي", threshold: 15 },
  { title: "محترف", threshold: 50 },
  { title: "عبقري", threshold: 150 },
  { title: "أسطورة الألغاز", threshold: 400 },
];

export const computeTotalStars = (progress: Progress): number => {
  let stars = 0;

  for (const score of Object.values(progress.completedGroups)) {
    const pct = (score / QUESTIONS_PER_GROUP) * 100;
    if (pct >= 90) stars += 3;
    else if (pct >= 60) stars += 2;
    else if (pct >= 30) stars += 1;
  }

  return stars;
};

export const getRank = (progress: Progress): RankInfo => {
  const stars = computeTotalStars(progress);
  let rankIndex = 0;

  for (let i = 0; i < RANKS.length; i++) {
    if (stars >= RANKS[i].threshold) rankIndex = i;
  }

  const current = RANKS[rankIndex];
  const next = RANKS[rankIndex + 1];
  const progressPct = next
    ? Math.max(
        0,
        Math.min(
          100,
          Math.round(((stars - current.threshold) / (next.threshold - current.threshold)) * 100)
        )
      )
    : 100;

  return { title: current.title, progress: progressPct };
};
