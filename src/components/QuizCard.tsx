import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Riddle, Language } from "@/data/riddles";
import { ui } from "@/data/i18n";
import { HelpCircle, CheckCircle, XCircle, SkipForward, Delete, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface QuizCardProps {
  riddle: Riddle;
  language: Language;
  onCorrectAnswer: () => void;
  onSkip: () => void;
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u064b-\u0652]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/^(the |a |an |le |la |les |un |une |el )/, "")
    .replace(/\s+/g, " ");

const normalizeForCompare = (value: string) =>
  normalize(value).replace(/\s+/g, "");

const getFirstLetters = (value: string) =>
  value.trim().split(/\s+/u).map((w) => w.charAt(0) || "").join(" ");

const getWordLengths = (value: string) =>
  value.trim().split(/\s+/u).map((w) => w.length).join(" / ");

const ARABIC_LETTERS = ["ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي", "ة", "ى"];
const LATIN_LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

const QuizCard = ({ riddle, language, onCorrectAnswer, onSkip }: QuizCardProps) => {
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const t = ui[language];
  const content = riddle.translations[language];
  const dir = "rtl";
  const primaryAnswer = content.answers[0];

  // Letter grid state
  const [pool, setPool] = useState<string[]>([]);
  const [selected, setSelected] = useState<{ char: string; poolIndex: number }[]>([]);

  // Split answer into words and map them to flat slot indices
  const words = primaryAnswer.split(/\s+/);
  let flatIndexCounter = 0;
  const wordSlots = words.map((word) => {
    return Array.from(word).map(() => {
      const idx = flatIndexCounter;
      flatIndexCounter++;
      return idx;
    });
  });
  const totalSlots = flatIndexCounter;

  // Initialize pool of letters
  useEffect(() => {
    setSelected([]);
    setIsCorrect(null);

    const cleanAnswer = primaryAnswer.replace(/\s+/g, "");
    const answerChars = Array.from(cleanAnswer);
    const alphabet = language === "ar" ? ARABIC_LETTERS : LATIN_LETTERS;

    // Calculate balanced grid size (even number, minimum 12, at least 4 distractors)
    let targetSize = answerChars.length + 4;
    if (targetSize < 12) targetSize = 12;
    if (targetSize % 2 !== 0) targetSize += 1;

    const numDistractors = targetSize - answerChars.length;
    const distractors: string[] = [];
    for (let i = 0; i < numDistractors; i++) {
      const rand = alphabet[Math.floor(Math.random() * alphabet.length)];
      distractors.push(rand);
    }

    const combined = [...answerChars, ...distractors];
    // Shuffle pool
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    setPool(combined);
  }, [riddle.id, language, primaryAnswer]);

  const hintVariants = [
    { label: "تلميح", text: content.hint },
    { label: "الحروف الأولى", text: getFirstLetters(primaryAnswer) },
    { label: "عدد الحروف", text: getWordLengths(primaryAnswer) },
  ];

  const checkAnswer = (currentSelection: { char: string; poolIndex: number }[]) => {
    const answerString = currentSelection.map((s) => s.char).join("");
    const allAnswers = Object.values(riddle.translations).flatMap((tr) => tr.answers);
    const isAnswerCorrect = allAnswers.some(
      (a) => normalizeForCompare(a) === normalizeForCompare(answerString)
    );

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      toast({ title: t.correct, description: t.correctDesc, variant: "default" });
      setTimeout(() => {
        setSelected([]);
        setIsCorrect(null);
        setShowHint(false);
        onCorrectAnswer();
      }, 1200);
    } else {
      toast({ title: t.wrong, description: t.wrongDesc, variant: "destructive" });
    }
  };

  const handleSelectLetter = (char: string, poolIndex: number) => {
    if (selected.length >= totalSlots) return;
    const newSelected = [...selected, { char, poolIndex }];
    setSelected(newSelected);

    if (newSelected.length === totalSlots) {
      checkAnswer(newSelected);
    } else {
      setIsCorrect(null);
    }
  };

  const handleRemoveSlot = (slotIndex: number) => {
    if (slotIndex >= selected.length) return;
    const newSelected = [...selected];
    newSelected.splice(slotIndex, 1);
    setSelected(newSelected);
    setIsCorrect(null);
  };

  const handleBackspace = () => {
    if (selected.length === 0) return;
    setSelected(selected.slice(0, -1));
    setIsCorrect(null);
  };

  const handleClear = () => {
    setSelected([]);
    setIsCorrect(null);
  };

  const showRiddleHint = () => {
    setShowHint(true);
    toast({ title: "تلميح 💡", description: content.hint });
  };

  const getGridColsClass = (length: number) => {
    if (length <= 12) return "grid-cols-6";
    if (length <= 14) return "grid-cols-7";
    return "grid-cols-8";
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${riddle.id}-${language}`}
        dir={dir}
        initial={{ opacity: 0, x: 60, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -60, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <div className="glass rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-white/6">
            <div className="flex items-center justify-between mb-4">
              <span className="badge-ar">عربي 🌙</span>
              <span className="text-white/40 text-sm font-medium">سؤال #{riddle.id}</span>
            </div>
            <h3 className="text-2xl font-bold text-white leading-relaxed">
              {content.question}
            </h3>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Answer Slots Display */}
            <div className="flex flex-wrap justify-center gap-6 py-2">
              {wordSlots.map((word, wordIdx) => (
                <div key={wordIdx} className="flex gap-1.5 flex-row-reverse">
                  {word.map((slotIndex) => {
                    const selectedItem = selected[slotIndex];
                    return (
                      <button
                        key={slotIndex}
                        type="button"
                        onClick={() => handleRemoveSlot(slotIndex)}
                        className={`w-10 h-12 sm:w-12 sm:h-14 rounded-xl border-2 flex items-center justify-center text-xl font-black transition-all duration-200 ${
                          selectedItem
                            ? isCorrect === true
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                              : isCorrect === false
                              ? "border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                              : "border-violet-500/40 bg-violet-500/5 text-white"
                            : "border-white/10 bg-white/5 text-transparent cursor-default"
                        }`}
                      >
                        {selectedItem ? selectedItem.char : ""}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Backspace / Delete Controls */}
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={handleBackspace}
                disabled={selected.length === 0 || isCorrect === true}
                className="btn-ghost-dark flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold disabled:opacity-30 disabled:pointer-events-none"
              >
                <Delete size={16} />
                <span>حذف</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={selected.length === 0 || isCorrect === true}
                className="btn-ghost-dark flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-red-400 border-red-500/20 bg-red-500/5 hover:bg-red-500/10 disabled:opacity-30 disabled:pointer-events-none"
              >
                <Trash2 size={16} />
                <span>مسح الكل</span>
              </button>
            </div>

            {/* Letter Pool Grid */}
            <div className="glass rounded-2xl p-4 border border-white/5">
              <div className={`grid ${getGridColsClass(pool.length)} gap-2 justify-items-center`}>
                {pool.map((char, index) => {
                  const isUsed = selected.some((s) => s.poolIndex === index);
                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={isUsed || isCorrect === true}
                      onClick={() => handleSelectLetter(char, index)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg font-extrabold border transition-all duration-150 ${
                        isUsed
                          ? "border-white/5 bg-white/2 text-transparent pointer-events-none opacity-10 scale-90"
                          : "border-white/10 bg-white/5 text-white hover:border-emerald-500/40 hover:bg-white/10 active:scale-95 cursor-pointer shadow-sm"
                      }`}
                    >
                      {char}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hint Button Only */}
            <div className="pt-2">
              <button
                type="button"
                onClick={showRiddleHint}
                className="btn-ghost-dark w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold"
              >
                <HelpCircle size={16} />
                {t.hint}
              </button>
            </div>

            {/* Hint Panel */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
                    <p className="text-amber-400 text-sm font-bold flex items-center gap-2">
                      💡 التلميحات
                    </p>
                    {hintVariants.map((variant) => (
                      <div key={variant.label} className="flex items-start gap-3">
                        <span className="text-white/40 text-xs mt-0.5 flex-shrink-0">{variant.label}:</span>
                        <span className="text-white/70 text-sm">{variant.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex justify-between items-center border-t border-white/5 pt-4">
            <button
              onClick={onSkip}
              className="btn-ghost-dark flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
            >
              <SkipForward size={14} />
              {t.skip}
            </button>

            <AnimatePresence>
              {isCorrect === true && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-emerald-400 font-bold text-sm"
                >
                  <CheckCircle size={16} /> {t.correct} 🎉
                </motion.span>
              )}
              {isCorrect === false && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-red-400 font-bold text-sm"
                >
                  <XCircle size={16} /> {t.tryAgain}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuizCard;
