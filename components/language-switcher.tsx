import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Language, useLanguage } from "@/store/language";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="bg-background flex rounded overflow-hidden w-fit">
      <Button
        variant={"ghost"}
        onClick={() => setLanguage("en")}
        className={cn(
          "rounded-none cursor-pointer font-anek-latin",
          language === "en" && "bg-foreground/10"
        )}
      >
        English
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => setLanguage("kn")}
        className={cn(
          "rounded-none cursor-pointer font-anek-kannada",
          language === "kn" && "bg-foreground/10"
        )}
      >
        ಕನ್ನಡ
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => setLanguage("bn")}
        className={cn(
          "rounded-none cursor-pointer font-anek-bengali",
          language === "bn" && "bg-foreground/10"
        )}
      >
        বাংলা
      </Button>
    </div>
  );
}
