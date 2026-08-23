import { useState, useEffect } from "react";
import { Language, languages } from "@/data/riddles";
import { ui } from "@/data/i18n";

const LANGUAGE_STORAGE_KEY = "bilquiz_language";

export const useLanguage = () => {
  const language: Language = "ar";
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const changeLanguage = (newLang: Language) => {
    // Disabled as per user request to force Arabic
  };

  useEffect(() => {
     if (hasMounted) {
         document.documentElement.dir = "rtl";
         document.documentElement.lang = "ar";
     }
  }, [hasMounted]);

  return {
    language: "ar" as Language,
    changeLanguage,
    dir: "rtl" as const,
    t: ui["ar"],
    hasMounted,
  };
};
