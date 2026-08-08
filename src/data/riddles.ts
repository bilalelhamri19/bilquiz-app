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

const ltrNumber = (value: number) => `\u2066${value}\u2069`;

const numericTemplates = [
  {
    en: (n: number) => `What comes after ${n}?`,
    ar: (n: number) => `كم يأتي بعد ${ltrNumber(n)}؟`,
    fr: (n: number) => `Quel nombre vient après ${n} ?`,
    es: (n: number) => `¿Qué número viene después de ${n}?`,
    hintAr: (n: number) => `هو العدد الذي يلي ${ltrNumber(n)}`,
    hintEn: (n: number) => `It is the number after ${n}.`,
    hintFr: (n: number) => `C'est le nombre qui suit ${n}.`,
    hintEs: (n: number) => `Es el número que viene después de ${n}.`,
  },
  {
    en: (n: number) => `What number comes before ${n + 2}?`,
    ar: (n: number) => `ما هو العدد الذي يسبق ${ltrNumber(n + 2)}؟`,
    fr: (n: number) => `Quel nombre vient avant ${n + 2} ?`,
    es: (n: number) => `¿Qué número viene antes de ${n + 2}?`,
    hintAr: (n: number) => `هو العدد الذي يسبق ${ltrNumber(n + 2)}`,
    hintEn: (n: number) => `It's one less than ${n + 2}.`,
    hintFr: (n: number) => `C'est un de moins que ${n + 2}.`,
    hintEs: (n: number) => `Es uno menos que ${n + 2}.`,
  },
  {
    en: (n: number) => `Add one to ${n}. What number do you get?`,
    ar: (n: number) => `أضف واحدًا إلى ${ltrNumber(n)}. ما العدد؟`,
    fr: (n: number) => `Ajoute un à ${n}. Quel nombre obtiens-tu ?`,
    es: (n: number) => `Suma uno a ${n}. ¿Qué número obtienes?`,
    hintAr: (n: number) => `إنه العدد بعد إضافة واحد إلى ${ltrNumber(n)}`,
    hintEn: (n: number) => `It's one more than ${n}.`,
    hintFr: (n: number) => `C'est un de plus que ${n}.`,
    hintEs: (n: number) => `Es uno más que ${n}.`,
  },
  {
    en: (n: number) => `If you have ${n} apples and get one more, how many apples do you have?`,
    ar: (n: number) => `إذا كان لديك ${ltrNumber(n)} تفاحة وأضفت واحدة، كم يصبح العدد؟`,
    fr: (n: number) => `Si tu as ${n} pommes et en reçois une de plus, combien en as-tu ?`,
    es: (n: number) => `Si tienes ${n} manzanas y recibes una más, ¿cuántas tienes?`,
    hintAr: (n: number) => `أضف التفاحة الإضافية إلى ${ltrNumber(n)}`,
    hintEn: (n: number) => `Add one apple to ${n}.`,
    hintFr: (n: number) => `Ajoute une pomme à ${n}.`,
    hintEs: (n: number) => `Suma una manzana a ${n}.`,
  },
];

const generateNumericRiddles = (startId: number, endId: number): Riddle[] =>
  Array.from({ length: endId - startId + 1 }, (_, index) => {
    const id = startId + index;
    const n = id;
    const template = numericTemplates[index % numericTemplates.length];
    const answer = `${n + 1}`;

    return {
      id,
      translations: {
        ar: {
          question: template.ar(n),
          answers: [answer],
          hint: template.hintAr(n),
        },
        en: {
          question: template.en(n),
          answers: [answer],
          hint: template.hintEn(n),
        },
        fr: {
          question: template.fr(n),
          answers: [answer],
          hint: template.hintFr(n),
        },
        es: {
          question: template.es(n),
          answers: [answer],
          hint: template.hintEs(n),
        },
      },
    };
  });

export const riddles: Riddle[] = [
  ...baseRiddles,
  ...generateNumericRiddles(11, 1000),
];
