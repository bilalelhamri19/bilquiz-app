export type Language = "ar" | "en" | "fr" | "es";

export interface LocalizedRiddle {
  question: string;
  answers: string[];
  hint: string;
}

export interface Riddle {
  id: number;
  translations: Record<Language, LocalizedRiddle>;
}

export const languages: { code: Language; label: string; dir: "rtl" | "ltr"; flag: string }[] = [
  { code: "ar", label: "العربية", dir: "rtl", flag: "🇸🇦" },
  { code: "en", label: "English", dir: "ltr", flag: "🇬🇧" },
  { code: "fr", label: "Français", dir: "ltr", flag: "🇫🇷" },
  { code: "es", label: "Español", dir: "ltr", flag: "🇪🇸" },
];

const baseRiddles: Riddle[] = [
  {
    id: 1,
    translations: {
      ar: {
        question: "أتحدث بلا فم وأسمع بلا أذنين، ليس لي جسد لكنني أعيش مع الريح. ما أنا؟",
        answers: ["صدى", "الصدى"],
        hint: "تسمعني يرتد إليك",
      },
      en: {
        question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
        answers: ["echo", "an echo"],
        hint: "You hear me bouncing back to you",
      },
      fr: {
        question: "Je parle sans bouche et j'entends sans oreilles. Je n'ai pas de corps, mais je vis avec le vent. Que suis-je ?",
        answers: ["echo", "écho", "un écho"],
        hint: "Tu m'entends revenir vers toi",
      },
      es: {
        question: "Hablo sin boca y oigo sin oídos. No tengo cuerpo, pero vivo con el viento. ¿Qué soy?",
        answers: ["eco", "el eco"],
        hint: "Me oyes rebotar hacia ti",
      },
    },
  },
  {
    id: 2,
    translations: {
      ar: {
        question: "ما هو الشيء الذي له مفاتيح ولا أقفال، وله مساحة ولا غرف، وتستطيع الدخول إليه دون أن تدخله؟",
        answers: ["لوحة المفاتيح", "كيبورد"],
        hint: "تستعمله مع الحاسوب كل يوم",
      },
      en: {
        question: "What has keys but no locks, space but no room, and you can enter but not go in?",
        answers: ["keyboard", "a keyboard"],
        hint: "You use it every day with your computer",
      },
      fr: {
        question: "Qu'est-ce qui a des touches mais pas de serrures, de l'espace mais pas de pièce, et où l'on entre sans y aller ?",
        answers: ["clavier", "un clavier"],
        hint: "Tu l'utilises chaque jour avec ton ordinateur",
      },
      es: {
        question: "¿Qué tiene teclas pero no cerraduras, espacio pero no habitación, y puedes entrar sin pasar?",
        answers: ["teclado", "el teclado"],
        hint: "Lo usas cada día con tu ordenador",
      },
    },
  },
  {
    id: 3,
    translations: {
      ar: {
        question: "لدي مدن بلا بيوت، وجبال بلا أشجار، وماء بلا سمك. ما أنا؟",
        answers: ["خريطة", "الخريطة"],
        hint: "تستعملها لتجد طريقك",
      },
      en: {
        question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
        answers: ["map", "a map"],
        hint: "You use it to find your way",
      },
      fr: {
        question: "J'ai des villes sans maisons, des montagnes sans arbres et de l'eau sans poissons. Que suis-je ?",
        answers: ["carte", "une carte", "carte géographique"],
        hint: "Tu l'utilises pour trouver ton chemin",
      },
      es: {
        question: "Tengo ciudades sin casas, montañas sin árboles y agua sin peces. ¿Qué soy?",
        answers: ["mapa", "un mapa"],
        hint: "Lo usas para encontrar el camino",
      },
    },
  },
  {
    id: 4,
    translations: {
      ar: {
        question: "ما هو الشيء الذي يكون أمامك دائمًا ولا يمكنك رؤيته؟",
        answers: ["المستقبل", "مستقبل"],
        hint: "له علاقة بالزمن",
      },
      en: {
        question: "What is always in front of you but can't be seen?",
        answers: ["future", "the future"],
        hint: "It's related to time",
      },
      fr: {
        question: "Qu'est-ce qui est toujours devant toi mais qu'on ne peut pas voir ?",
        answers: ["futur", "le futur", "avenir", "l'avenir"],
        hint: "C'est lié au temps",
      },
      es: {
        question: "¿Qué está siempre delante de ti pero no se puede ver?",
        answers: ["futuro", "el futuro"],
        hint: "Tiene que ver con el tiempo",
      },
    },
  },
  {
    id: 5,
    translations: {
      ar: {
        question: "ما هو الشيء الذي يتبلل أثناء التجفيف؟",
        answers: ["منشفة", "المنشفة", "فوطة"],
        hint: "تستعملها بعد الاستحمام",
      },
      en: {
        question: "What gets wet while drying?",
        answers: ["towel", "a towel"],
        hint: "You use it after a shower",
      },
      fr: {
        question: "Qu'est-ce qui se mouille en séchant ?",
        answers: ["serviette", "une serviette", "essuie"],
        hint: "Tu l'utilises après la douche",
      },
      es: {
        question: "¿Qué se moja mientras seca?",
        answers: ["toalla", "la toalla"],
        hint: "La usas después de la ducha",
      },
    },
  },
  {
    id: 6,
    translations: {
      ar: {
        question: "ما هو الشيء الذي له رأس وذيل لكن بلا جسد؟",
        answers: ["عملة", "نقود", "قطعة نقدية", "عملة معدنية"],
        hint: "تدفع به ثمن الأشياء",
      },
      en: {
        question: "What has a head and a tail, but no body?",
        answers: ["coin", "a coin"],
        hint: "You use it to pay for things",
      },
      fr: {
        question: "Qu'est-ce qui a une tête et une queue, mais pas de corps ?",
        answers: ["pièce", "une pièce", "pièce de monnaie"],
        hint: "Tu l'utilises pour payer",
      },
      es: {
        question: "¿Qué tiene cara y cruz, pero no cuerpo?",
        answers: ["moneda", "una moneda"],
        hint: "La usas para pagar",
      },
    },
  },
  {
    id: 7,
    translations: {
      ar: {
        question: "أنا خفيف كالريشة، لكن أقوى إنسان لا يستطيع حملي لأكثر من دقائق. ما أنا؟",
        answers: ["نفس", "النفس", "التنفس", "الهواء في الرئتين"],
        hint: "تفعله تلقائيًا لتبقى حيًا",
      },
      en: {
        question: "I'm light as a feather, but the strongest person can't hold me for more than a few minutes. What am I?",
        answers: ["breath", "your breath"],
        hint: "You do it automatically to stay alive",
      },
      fr: {
        question: "Je suis léger comme une plume, mais la personne la plus forte ne peut me retenir plus de quelques minutes. Que suis-je ?",
        answers: ["souffle", "le souffle", "respiration", "la respiration"],
        hint: "Tu le fais automatiquement pour vivre",
      },
      es: {
        question: "Soy ligero como una pluma, pero la persona más fuerte no puede sostenerme más de unos minutos. ¿Qué soy?",
        answers: ["aliento", "respiración", "la respiración"],
        hint: "Lo haces automáticamente para vivir",
      },
    },
  },
  {
    id: 8,
    translations: {
      ar: {
        question: "ما هو الشيء الذي له مفاتيح كثيرة ولا يفتح أي قفل؟",
        answers: ["بيانو", "البيانو"],
        hint: "إنه آلة موسيقية",
      },
      en: {
        question: "What has many keys but can't open a single lock?",
        answers: ["piano", "a piano"],
        hint: "It's a musical instrument",
      },
      fr: {
        question: "Qu'est-ce qui a beaucoup de touches mais n'ouvre aucune serrure ?",
        answers: ["piano", "un piano"],
        hint: "C'est un instrument de musique",
      },
      es: {
        question: "¿Qué tiene muchas teclas pero no abre ninguna cerradura?",
        answers: ["piano", "un piano"],
        hint: "Es un instrumento musical",
      },
    },
  },
  {
    id: 9,
    translations: {
      ar: {
        question: "ما هو الشيء الذي له أرجل ولا يسير؟",
        answers: ["طاولة", "الطاولة", "مائدة"],
        hint: "تأكل عليه",
      },
      en: {
        question: "What has legs, but doesn't walk?",
        answers: ["table", "a table"],
        hint: "You eat on it",
      },
      fr: {
        question: "Qu'est-ce qui a des pieds mais ne marche pas ?",
        answers: ["table", "une table"],
        hint: "Tu manges dessus",
      },
      es: {
        question: "¿Qué tiene patas pero no camina?",
        answers: ["mesa", "una mesa"],
        hint: "Comes sobre ella",
      },
    },
  },
  {
    id: 10,
    translations: {
      ar: {
        question: "كلما أخذت منه أكثر، كبر أكثر. ما هو؟",
        answers: ["حفرة", "الحفرة"],
        hint: "تحفره في الأرض",
      },
      en: {
        question: "The more you take away from me, the bigger I get. What am I?",
        answers: ["hole", "a hole"],
        hint: "You dig it in the ground",
      },
      fr: {
        question: "Plus tu m'enlèves, plus je deviens grand. Que suis-je ?",
        answers: ["trou", "un trou"],
        hint: "Tu le creuses dans le sol",
      },
      es: {
        question: "Cuanto más me quitas, más grande me hago. ¿Qué soy?",
        answers: ["agujero", "un agujero", "hoyo"],
        hint: "Lo cavas en el suelo",
      },
    },
  },
];

const ltrNumber = (value: number | string) => `\u2066${value}\u2069`;

type ArabicPuzzle = Omit<LocalizedRiddle, "answers"> & { answers: string[] };

const logicalRiddle = (id: number, puzzle: ArabicPuzzle): Riddle => ({
  id,
  // The current game is Arabic-only. Keeping the same fallback prevents an
  // incomplete translation from making a riddle unplayable in the future.
  translations: { ar: puzzle, en: puzzle, fr: puzzle, es: puzzle },
});

const logicalPuzzles: ArabicPuzzle[] = [
  { question: `عندك ${ltrNumber(9)} كرات متشابهة، واحدة أثقل من الباقي، وميزان كفتين. ما أقل عدد من الوزنات لمعرفة الكرة؟`, answers: ["2", "اثنان"], hint: "قسّم الكرات إلى ثلاث مجموعات متساوية." },
  { question: `عندك ${ltrNumber(12)} قطعة نقدية، واحدة مختلفة في الوزن، وميزان كفتين. ما أقل عدد من الوزنات لمعرفة القطعة؟`, answers: ["3", "ثلاث"], hint: "هذا لغز الميزان الكلاسيكي." },
  { question: `أربعة أشخاص يعبرون جسراً ليلاً: أزمنتهم ${ltrNumber(1)} و${ltrNumber(2)} و${ltrNumber(7)} و${ltrNumber(10)} دقائق، والمصباح واحد. ما أقل وقت لعبورهم جميعاً؟`, answers: ["17", "سبعة عشر"], hint: "الأسرعان يعيدان المصباح." },
  { question: "في عائلة يوجد أبوان وابنان، لكن عدد الأشخاص ثلاثة فقط. كيف؟", answers: ["جد وأب وابن", "جد اب وابن"], hint: "الأب ابنٌ أيضاً." },
  { question: "لرجل سبع بنات، ولكل بنت أخ واحد. كم عدد الأبناء؟", answers: ["8", "ثمانية"], hint: "الأخ مشترك بينهن." },
  { question: "ثلاث قطط تصطاد ثلاث فئران في ثلاث دقائق. كم دقيقة تحتاج مئة قطة لاصطياد مئة فأر؟", answers: ["3", "ثلاث"], hint: "كل قطة تصطاد فأراً في الوقت نفسه." },
  { question: "أيهما أثقل: كيلوغرام من الحديد أم كيلوغرام من الريش؟", answers: ["متساويان", "متساوي"], hint: "قارن الكتلة لا الحجم." },
  { question: `مكعب مكوّن من ${ltrNumber(27)} مكعباً صغيراً طُليت كل أوجهه ثم فُكك. كم مكعباً صغيراً بلا طلاء؟`, answers: ["1", "واحد"], hint: "فكّر في المكعب الموجود في الوسط." },
  { question: "كم شهراً في السنة يحتوي على 28 يوماً؟", answers: ["12", "اثنا عشر"], hint: "كل الشهور فيها على الأقل 28 يوماً." },
  { question: "أمامك ثلاثة مفاتيح خارج غرفة مغلقة، وداخلها مصباح واحد. كيف تميّز مفتاح المصباح بدخول واحد؟ ما الدليل الذي تستعمله؟", answers: ["حرارة المصباح", "حرارة"], hint: "شغّل مفتاحاً ثم أطفئه قبل الدخول." },
  { question: "ثلاثة صناديق مكتوب عليها: تفاح، برتقال، مختلط. كل الملصقات خاطئة. من أي صندوق تبدأ بسحب ثمرة واحدة؟", answers: ["مختلط", "الصندوق المختلط"], hint: "اختر الملصق الذي لا يمكن أن يكون صحيحاً." },
  { question: "في سباق، تجاوزتَ الشخص الذي في المرتبة الثانية. ما هي مرتبتك الآن؟", answers: ["الثانية", "ثاني"], hint: "لم تتجاوز المتسابق الأول." },
  { question: "رجل قصير يسكن في الطابق العشرين، يصعد بالمصعد إلى العاشر ثم يكمل مشياً، إلا في الأيام الماطرة. لماذا؟", answers: ["قصير", "قصير القامة"], hint: "في المطر يحمل شيئاً أطول منه." },
  { question: "رجل خرج تحت المطر بلا مظلة ولا قبعة، ولم تبتل شعرة واحدة من رأسه. لماذا؟", answers: ["أصلع", "كان أصلع"], hint: "المشكلة ليست في المطر." },
  { question: "ما الشيء الذي إذا نطقت باسمه كسرته؟", answers: ["الصمت", "صمت"], hint: "يتطلب بقاءه عدم الكلام." },
  { question: `ما العدد التالي في النمط: ${ltrNumber(1)}، ${ltrNumber(11)}، ${ltrNumber(21)}، ${ltrNumber(1211)}، ؟`, answers: ["111221"], hint: "كل حد يصف أرقام الحد الذي قبله." },
  { question: `ما العدد التالي: ${ltrNumber(2)}، ${ltrNumber(3)}، ${ltrNumber(5)}، ${ltrNumber(9)}، ${ltrNumber(17)}، ؟`, answers: ["33"], hint: "أضف ضعف الزيادة السابقة." },
  { question: `ما العدد التالي: ${ltrNumber(1)}، ${ltrNumber(2)}، ${ltrNumber(6)}، ${ltrNumber(24)}، ${ltrNumber(120)}، ؟`, answers: ["720"], hint: "كل مرة اضرب في العدد التالي." },
  { question: `ما العدد التالي: ${ltrNumber(3)}، ${ltrNumber(6)}، ${ltrNumber(11)}، ${ltrNumber(18)}، ؟`, answers: ["27"], hint: "الزيادات هي أعداد فردية متتالية." },
  { question: `ما العدد التالي: ${ltrNumber(81)}، ${ltrNumber(27)}، ${ltrNumber(9)}، ${ltrNumber(3)}، ؟`, answers: ["1", "واحد"], hint: "القسمة ثابتة." },
  { question: `ما العدد التالي: ${ltrNumber(4)}، ${ltrNumber(7)}، ${ltrNumber(13)}، ${ltrNumber(25)}، ؟`, answers: ["49"], hint: "اضرب الفرق في اثنين." },
  { question: `ما العدد التالي: ${ltrNumber(1)}، ${ltrNumber(4)}، ${ltrNumber(10)}، ${ltrNumber(22)}، ؟`, answers: ["46"], hint: "كل حد يساوي السابق في اثنين زائد اثنين." },
  { question: "إذا كان أمس هو غد الخميس، فما هو اليوم؟", answers: ["السبت", "سبت"], hint: "حوّل عبارة أمس إلى اليوم الحالي أولاً." },
  { question: "لديك حبلان، كل واحد يحترق في ساعة لكن بشكل غير منتظم. كيف تقيس 45 دقيقة؟", answers: ["45", "خمسة واربعون"], hint: "أشعل الحبل الأول من الطرفين والثاني من طرف واحد." },
  { question: "أمامك بابان: أحدهما للنجاة والآخر للخطر، وحارسان أحدهما يكذب دائماً. ما السؤال الذي تسأله لتعرف باب النجاة؟", answers: ["ماذا سيقول الآخر", "الآخر"], hint: "اسأل أي حارس عن جواب الحارس الثاني ثم اختر العكس." },
  { question: "طبيب أعطاك ثلاث حبات دواء وقال: خذ حبة كل نصف ساعة. كم تستغرق لإنهائها؟", answers: ["ساعة", "60"], hint: "الحبة الأولى تؤخذ فوراً." },
  { question: "سقطت طائرة على الحدود بين بلدين. أين يدفنون الناجين؟", answers: ["لا يدفنون", "لايدفنون"], hint: "الناجون أحياء." },
  { question: "لديك ستة جوارب سوداء وستة بيضاء في الظلام. كم جورباً تسحب لتضمن زوجاً من اللون نفسه؟", answers: ["3", "ثلاث"], hint: "فكّر في أسوأ احتمال." },
  { question: "أي مكان على الأرض إذا مشيت منه جنوباً ثم شرقاً ثم شمالاً تعود إليه؟", answers: ["القطب الشمالي", "القطب"], hint: "ابدأ من أقصى الشمال." },
  { question: "شخص ينظر إلى صورة ويقول: ليس لي أخ أو أخت، لكن والد هذا الرجل هو ابن أبي. من في الصورة؟", answers: ["ابنه", "ابن"], hint: "ابن أبي هو المتكلم نفسه." },
  { question: "أم أحمد لديها أربعة أبناء: شمال وجنوب وشرق. ما اسم الابن الرابع؟", answers: ["أحمد"], hint: "الاسم مذكور في بداية السؤال." },
  { question: "ما العدد الذي إذا ضربته في نفسه ثم أضفت إليه نفسه كان الناتج 42؟", answers: ["6", "ستة"], hint: "حل المعادلة س² + س = 42." },
  { question: "في ساعة عقاربها متطابقة عند الثانية عشرة. كم مرة تتطابق العقارب خلال 12 ساعة؟", answers: ["11", "احد عشر"], hint: "لا تتطابق تماماً عند كل ساعة." },
  { question: "أب عمره أربعة أضعاف عمر ابنه. بعد 20 سنة سيصبح عمره ضعف عمر ابنه. كم عمر الابن الآن؟", answers: ["10", "عشرة"], hint: "ضع عمر الابن سناً." },
  { question: "لديك إناء 3 لترات وإناء 5 لترات فقط. كم لتراً يمكنك قياسه بدقة باستعمالهما؟", answers: ["4", "أربعة"], hint: "املأ الكبير ثم انقل منه إلى الصغير مرتين." },
  { question: "ثلاثة أرقام مجموعها 6 وحاصل ضربها 6. ما هي؟", answers: ["123", "1 2 3"], hint: "استعمل أصغر الأعداد الموجبة." },
  { question: "ما العدد الذي إذا قلبته أصبح أكبر؟", answers: ["6", "ستة"], hint: "فكّر في شكله عند تدويره." },
  { question: "في قرية، الحلاق يحلق لكل من لا يحلق لنفسه فقط. هل يحلق الحلاق لنفسه؟", answers: ["مستحيل", "لا يمكن"], hint: "أي جواب يؤدي إلى تناقض." },
];

const logicalRiddles = logicalPuzzles.map((puzzle, index) => logicalRiddle(index + baseRiddles.length + 1, puzzle));

export const riddles: Riddle[] = [
  ...baseRiddles,
  ...logicalRiddles,
];
