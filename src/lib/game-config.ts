import { riddles } from "@/data/riddles";

export const QUESTIONS_PER_GROUP = 10;
export const MIN_SCORE_TO_UNLOCK_GROUP = 6;
export const STORAGE_KEY = "bilquiz_progress";
export const THEME_STORAGE_KEY = "bilquiz_theme";
export const SOUND_STORAGE_KEY = "bilquiz_sound";
export const MUSIC_STORAGE_KEY = "bilquiz_music";
export const COINS_PER_CORRECT_ANSWER = 5;

export const allGroups = Array.from(
  { length: Math.ceil(riddles.length / QUESTIONS_PER_GROUP) },
  (_, i) => riddles.slice(i * QUESTIONS_PER_GROUP, (i + 1) * QUESTIONS_PER_GROUP)
);

export const totalGroups = allGroups.length;
export const totalRiddles = allGroups.reduce((sum, group) => sum + group.length, 0);
export const maxStars = totalGroups * 3;
