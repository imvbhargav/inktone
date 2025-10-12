"use client";

import React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { EditorToolbarProps } from "../../types/editor";
import { useLanguage } from "@/store/language";
import { exportName, languageFonts, untitledDocument } from "@/constants/i18n";
import { cn } from "@/lib/utils";

export function EditorToolbar({
  title,
  onTitleChange,
  onExport,
  onPrint,
  exportOptions,
}: EditorToolbarProps) {
  const { language } = useLanguage();
  return (
    <div className="p-2 md:px-4 border-b flex flex-col-reverse items-end md:flex-row justify-end print:justify-start print:items-start gap-2">
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder={untitledDocument[language]}
        className={cn(
          "mt-4 md:mt-0 md:text-lg rounded bg-transparent dark:bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-foreground/10 focus:ring-foreground/10 font-semibold w-full px-1 font-anek-latin print:hidden",
          languageFonts[language]
        )}
      />
      <h1 className="text-4xl font-bold hidden print:block">{title}</h1>
      <div className="w-full flex justify-end items-center p-2 md:p-0 print:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={cn(
                "rounded cursor-pointer flex items-center gap-2",
                languageFonts[language]
              )}
            >
              <Upload size={16} /> {exportName[language]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="cursor-pointer font-sans" align="end">
            {exportOptions.map((option) => (
              <DropdownMenuItem
                className="cursor-pointer font-sans"
                key={option.id}
                onClick={() => {
                  if (option.id === "print") {
                    onPrint();
                  } else {
                    onExport(option.id);
                  }
                }}
              >
                {option.icon}
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
