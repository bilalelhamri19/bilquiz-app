/**
 * Calculate star rating based on score percentage.
 * @returns 0-3 stars
 */
export const getStars = (score: number, total: number): number => {
  const pct = (score / total) * 100;
  if (pct >= 90) return 3;
  if (pct >= 60) return 2;
  if (pct >= 30) return 1;
  return 0;
};
