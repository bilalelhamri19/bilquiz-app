import { useState, useEffect } from "react";
import { Language, languages } from "@/data/riddles";
import { ui } from "@/data/i18n";

const LANGUAGE_STORAGE_KEY = "bilquiz_language";

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>("ar");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      if (saved && languages.some((l) => l.code === saved)) {
        setLanguage(saved);
      }
    } catch {}
    setHasMounted(true);
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      document.documentElement.dir = languages.find((l) => l.code === newLang)?.dir || "ltr";
      document.documentElement.lang = newLang;
    } catch {}
  };

  useEffect(() => {
     if (hasMounted) {
         document.documentElement.dir = languages.find((l) => l.code === language)?.dir || "ltr";
         document.documentElement.lang = language;
     }
  }, [language, hasMounted]);

  const currentLanguageInfo = languages.find((l) => l.code === language)!;

  return {
    language,
    changeLanguage,
    dir: currentLanguageInfo?.dir || "ltr",
    t: ui[language] || ui["ar"],
    hasMounted,
  };
};
