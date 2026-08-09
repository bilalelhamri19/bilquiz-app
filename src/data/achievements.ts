import { Riddle, allRiddles } from "./riddles";
import { ui } from "./i18n";

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  goal: number;
  type:
    | "riddles_solved"
    | "perfect_groups"
    | "groups_unlocked"
    | "coins_earned"
    | "streak"
    | "hints_used"
    | "total_stars";
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_blood",
    icon: "🎯",
    title: "البداية الذكية",
    description: "حل أول ألغاز بنجاح",
    goal: 1,
    type: "riddles_solved",
  },
  {
    id: "ten_riddles",
    icon: "🔟",
    title: "متحمس الألغاز",
    description: "حل 10 ألغاز",
    goal: 10,
    type: "riddles_solved",
  },
  {
    id: "fifty_riddles",
    icon: "🎓",
    title: "باحث عن الحقيقة",
    description: "حل 50 لغز",
    goal: 50,
    type: "riddles_solved",
  },
  {
    id: "hundred_riddles",
    icon: "💯",
    title: "فيلسوف الألغاز",
    description: "حل 100 لغز",
    goal: 100,
    type: "riddles_solved",
  },
  {
    id: "three_hundred_riddles",
    icon: "🏆",
    title: "أسطورة الألغاز",
    description: "حل 300 لغز",
    goal: 300,
    type: "riddles_solved",
  },
  {
    id: "perfect_group",
    icon: "⭐",
    title: "مجموعة مثالية",
    description: "إنهاء مجموعة بثلاث نجوم (10/10)",
    goal: 1,
    type: "perfect_groups",
  },
  {
    id: "five_perfect_groups",
    icon: "🌟",
    title: "دقة خارقة",
    description: "5 مجموعات مثالية",
    goal: 5,
    type: "perfect_groups",
  },
  {
    id: "groups_5",
    icon: "🗝️",
    title: "المنطلق",
    description: "فتح 5 مجموعات",
    goal: 5,
    type: "groups_unlocked",
  },
  {
    id: "groups_20",
    icon: "🚪",
    title: "مستكشف",
    description: "فتح 20 مجموعة",
    goal: 20,
    type: "groups_unlocked",
  },
  {
    id: "groups_50",
    icon: "🗺️",
    title: "عالم المجهول",
    description: "فتح 50 مجموعة",
    goal: 50,
    type: "groups_unlocked",
  },
  {
    id: "coins_500",
    icon: "💰",
    title: "صائ الذهب",
    description: "جمع 500 قطعة ذهب",
    goal: 500,
    type: "coins_earned",
  },
  {
    id: "coins_2000",
    icon: "👑",
    title: "ملك الكنوز",
    description: "جمع 2000 قطعة ذهب",
    goal: 2000,
    type: "coins_earned",
  },
  {
    id: "streak_3",
    icon: "🔥",
    title: "شعلة ثلاثية",
    description: "لعب لمدة 3 أيام متتالية",
    goal: 3,
    type: "streak",
  },
  {
    id: "streak_7",
    icon: "⚡",
    title: "أسبوع كامل",
    description: "لعب لمدة أسبوع متتالي",
    goal: 7,
    type: "streak",
  },
  {
    id: "streak_30",
    icon: "🌠",
    title: "التزام شهري",
    description: "شهر كامل من المتعة الذهنية",
    goal: 30,
    type: "streak",
  },
  {
    id: "stars_10",
    icon: "✨",
    title: "نجوم الشهرة",
    description: "جمع 10 نجوم",
    goal: 10,
    type: "total_stars",
  },
  {
    id: "stars_100",
    icon: "🌌",
    title: "كوكب الأبطال",
    description: "جمع 100 نجمة",
    goal: 100,
    type: "total_stars",
  },
  {
    id: "hints_master",
    icon: "💡",
    title: "سيد التلميحات",
    description: "استخدم 50 تلميحاً",
    goal: 50,
    type: "hints_used",
  },
];

export const DAILY_REWARDS = [
  { day: 1, coins: 20, label: "مكافأة اليوم الأول" },
  { day: 2, coins: 30, label: "مكافأة اليوم الثاني" },
  { day: 3, coins: 40, label: "مكافأة اليوم الثالث" },
  { day: 4, coins: 50, label: "مكافأة اليوم الرابع" },
  { day: 5, coins: 75, label: "مكافأة اليوم الخامس" },
  { day: 6, coins: 100, label: "مكافأة اليوم السادس" },
  { day: 7, coins: 200, label: "مكافأة الأسبوع الكبير 🎁" },
];

export { allRiddles, ui };
