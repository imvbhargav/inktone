"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/store/language";
import { dark, light, system } from "@/constants/i18n";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();
  return (
    <div className="bg-background flex rounded overflow-hidden w-fit">
      <Button
        variant={"ghost"}
        onClick={() => setTheme("dark")}
        className={cn(
          "rounded-none cursor-pointer dark:bg-foreground/10",
          theme === "system" && "dark:bg-transparent"
        )}
        suppressHydrationWarning
      >
        <Moon /> {dark[language]}
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => setTheme("light")}
        className={cn(
          "rounded-none cursor-pointer bg-foreground/10 dark:bg-transparent",
          theme === "system" && "bg-transparent"
        )}
        suppressHydrationWarning
      >
        <Sun /> {light[language]}
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => setTheme("system")}
        className={cn(
          "rounded-none cursor-pointer",
          theme === "system" && "bg-foreground/10"
        )}
        suppressHydrationWarning
      >
        <Monitor /> {system[language]}
      </Button>
    </div>
  );
}
