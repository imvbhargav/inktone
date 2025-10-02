"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

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
        <Moon /> Dark
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
        <Sun /> Light
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
        <Monitor /> System
      </Button>
    </div>
  );
}
