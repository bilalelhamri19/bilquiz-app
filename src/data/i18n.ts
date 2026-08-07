import { Language } from "./riddles";

export interface UiStrings {
  tagline: string;
  intro: string;
  start: string;
  chooseLanguage: string;
  placeholder: string;
  hint: string;
  check: string;
  skip: string;
  correct: string;
  correctDesc: string;
  wrong: string;
  wrongDesc: string;
  tryAgain: string;
  skipped: string;
  skippedDesc: (answer: string) => string;
  question: string;
  questionOf: (current: number, total: number) => string;
  groupOf: (current: number, total: number) => string;
  hintFirstLetters: string;
  hintWordLengths: string;
  finished: string;
  restart: string;
  changeLanguage: string;
  outOf: (score: number, total: number) => string;
  messages: (percentage: number) => string;
}

export const ui: Record<Language, UiStrings> = {
  ar: {
    tagline: "اختبر ذكائك مع ألغاز صعبة",
    intro: "حاول الإجابة على الأسئلة الذكية وقم بتحدي نفسك أو أصدقائك. هل أنت جاهز؟",
    start: "ابدأ الآن",
    chooseLanguage: "اختر اللغة",
    placeholder: "أدخل إجابتك هنا...",
    hint: "تلميح",
    hintFirstLetters: "الحرف الأول",
    hintWordLengths: "طول الكلمات",
    check: "تحقق",
    skip: "تخطي",
    correct: "إجابة صحيحة!",
    correctDesc: "أحسنت! لقد أجبت بشكل صحيح",
    wrong: "إجابة خاطئة",
    wrongDesc: "حاول مرة أخرى أو استخدم التلميح",
    tryAgain: "حاول مرة أخرى",
    skipped: "تم التخطي",
    skippedDesc: (answer) => `الإجابة الصحيحة هي: ${answer}`,
    question: "سؤال",
    questionOf: (c, t) => `سؤال ${c} من ${t}`,
    groupOf: (c, t) => `المجموعة ${c} من ${t}`,
    finished: "انتهى الاختبار!",
    restart: "ابدأ من جديد",
    changeLanguage: "تغيير اللغة",
    outOf: (s, t) => `${s} من أصل ${t}`,
    messages: (p) =>
      p === 100 ? "مذهل! أنت عبقري الألغاز!" :
      p >= 80 ? "رائع! أداء ممتاز!" :
      p >= 60 ? "جيد جدا! تفكيرك منطقي!" :
      p >= 40 ? "حسنًا! استمر في المحاولة!" :
      "لا بأس، استمر في التعلم!",
  },
  en: {
    tagline: "Test your wits with tricky riddles",
    intro: "Answer the clever riddles and challenge yourself or your friends. Ready?",
    start: "Start now",
    chooseLanguage: "Choose a language",
    placeholder: "Type your answer here...",
    hint: "Hint",
    hintFirstLetters: "First letters",
    hintWordLengths: "Word lengths",
    check: "Check",
    skip: "Skip",
    correct: "Correct answer!",
    correctDesc: "Well done! That's right",
    wrong: "Wrong answer",
    wrongDesc: "Try again or use the hint",
    tryAgain: "Try again",
    skipped: "Skipped",
    skippedDesc: (answer) => `The correct answer is: ${answer}`,
    question: "Question",
    questionOf: (c, t) => `Question ${c} of ${t}`,
    groupOf: (c, t) => `Group ${c} of ${t}`,
    finished: "Quiz complete!",
    restart: "Play again",
    changeLanguage: "Change language",
    outOf: (s, t) => `${s} out of ${t}`,
    messages: (p) =>
      p === 100 ? "Amazing! You're a riddle genius!" :
      p >= 80 ? "Great! Excellent performance!" :
      p >= 60 ? "Very good! Solid logic!" :
      p >= 40 ? "Not bad! Keep trying!" :
      "No worries, keep learning!",
  },
  fr: {
    tagline: "Testez votre esprit avec des énigmes difficiles",
    intro: "Répondez aux énigmes malignes et défiez-vous ou vos amis. Prêt ?",
    start: "Commencer",
    chooseLanguage: "Choisissez une langue",
    placeholder: "Écrivez votre réponse ici...",
    hint: "Indice",
    hintFirstLetters: "Premières lettres",
    hintWordLengths: "Longueurs des mots",
    check: "Vérifier",
    skip: "Passer",
    correct: "Bonne réponse !",
    correctDesc: "Bravo ! C'est exact",
    wrong: "Mauvaise réponse",
    wrongDesc: "Réessayez ou utilisez l'indice",
    tryAgain: "Réessayez",
    skipped: "Passée",
    skippedDesc: (answer) => `La bonne réponse est : ${answer}`,
    question: "Question",
    questionOf: (c, t) => `Question ${c} sur ${t}`,
    groupOf: (c, t) => `Groupe ${c} sur ${t}`,
    finished: "Quiz terminé !",
    restart: "Rejouer",
    changeLanguage: "Changer de langue",
    outOf: (s, t) => `${s} sur ${t}`,
    messages: (p) =>
      p === 100 ? "Incroyable ! Vous êtes un génie des énigmes !" :
      p >= 80 ? "Super ! Excellente performance !" :
      p >= 60 ? "Très bien ! Belle logique !" :
      p >= 40 ? "Pas mal ! Continuez !" :
      "Pas de souci, continuez à apprendre !",
  },
  es: {
    tagline: "Pon a prueba tu ingenio con acertijos difíciles",
    intro: "Responde a los acertijos y desafíate a ti mismo o a tus amigos. ¿Listo?",
    start: "Empezar",
    chooseLanguage: "Elige un idioma",
    placeholder: "Escribe tu respuesta aquí...",
    hint: "Pista",
    hintFirstLetters: "Primeras letras",
    hintWordLengths: "Longitudes de palabras",
    check: "Comprobar",
    skip: "Saltar",
    correct: "¡Respuesta correcta!",
    correctDesc: "¡Bien hecho! Es correcto",
    wrong: "Respuesta incorrecta",
    wrongDesc: "Inténtalo de nuevo o usa la pista",
    tryAgain: "Inténtalo de nuevo",
    skipped: "Saltada",
    skippedDesc: (answer) => `La respuesta correcta es: ${answer}`,
    question: "Pregunta",
    questionOf: (c, t) => `Pregunta ${c} de ${t}`,
    groupOf: (c, t) => `Grupo ${c} de ${t}`,
    finished: "¡Quiz terminado!",
    restart: "Jugar de nuevo",
    changeLanguage: "Cambiar idioma",
    outOf: (s, t) => `${s} de ${t}`,
    messages: (p) =>
      p === 100 ? "¡Increíble! ¡Eres un genio de los acertijos!" :
      p >= 80 ? "¡Genial! ¡Excelente rendimiento!" :
      p >= 60 ? "¡Muy bien! ¡Buena lógica!" :
      p >= 40 ? "¡No está mal! ¡Sigue intentando!" :
      "Tranquilo, sigue aprendiendo",
  },
};
