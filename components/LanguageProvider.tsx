"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Language = "en" | "fr";

const LanguageContext = createContext<{
  language: Language;
  toggleLanguage: () => void;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const value = useMemo(
    () => ({
      language,
      toggleLanguage: () => {
        setLanguage((current) => (current === "en" ? "fr" : "en"));
      },
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider.");
  }

  return context;
}

export function LocalizedText({
  en,
  fr,
}: {
  en: ReactNode;
  fr: ReactNode;
}) {
  const { language } = useLanguage();
  return <>{language === "fr" ? fr : en}</>;
}
