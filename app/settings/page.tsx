"use client";

import LanguageSwitcher from "@/components/language-switcher";
import { ModeToggle } from "@/components/theme-toggle";
import { languageFonts, languageText, setting, theme } from "@/constants/i18n";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/store/language";

export default function Home() {
  const { language } = useLanguage();
  return (
    <div className={cn(languageFonts[language])}>
      <h1 className="p-4 text-2xl font-black border-b border-foreground/10 ">
        {setting[language]}
      </h1>
      <main className="p-4">
        <div className="w-fit p-4 rounded flex gap-2">
          <div className="flex flex-col gap-4  border border-accent-foreground/10 p-4 rounded">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold px-2">{theme[language]}</p>
              <div className="bg-card-foreground/5 p-1 rounded">
                <ModeToggle />
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-4  border border-accent-foreground/10 p-4 rounded">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold px-2">
                  {languageText[language]}
                </p>
                <div className="bg-card-foreground/5 p-1 rounded">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
