import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "kn" | "en" | "bn";

type LanguageStore = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "language-storage",
    }
  )
);
