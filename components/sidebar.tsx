"use client";

import {
  editor,
  languageFonts,
  logout,
  setting,
  siteName,
} from "@/constants/i18n";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/store/language";
import { Cog, FileEdit, LogOut, SidebarClose, SidebarOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const { language } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={cn(
        "print:hidden h-[calc(100vh-8px)] md:h-full bg-card p-1 rounded-r-md border border-l-0 border-card-foreground/10 transition-all duration-300",
        "md:relative w-64 absolute my-1 md:my-0 top-0 left-0 z-50",
        "flex flex-col justify-between",
        isOpen ? "left-0 md:w-64" : "-left-64 md:left-0 md:w-16"
      )}
    >
      <div className="flex justify-between items-center bg-background px-2 py-1 rounded-md border border-card-foreground/10">
        <Link
          href={"/"}
          className={cn(
            "font-black text-gray-900 dark:text-gray-100",
            !isOpen && "hidden",
            languageFonts[language],
            language !== "en" ? "text-xl" : "text-2xl"
          )}
        >
          {siteName[language]}
        </Link>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="cursor-pointer p-2 hover:bg-accent rounded-md"
        >
          {isOpen ? <SidebarClose size={22} /> : <SidebarOpen size={22} />}
        </button>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="cursor-pointer p-2 hover:bg-accent rounded-md fixed -z-10 md:hidden top-5 left-4"
        >
          {isOpen ? <SidebarClose size={22} /> : <SidebarOpen size={22} />}
        </button>
      </div>
      <div
        className={cn(
          "flex flex-col rounded-md border border-card-foreground/10 divide-y divide-card-foreground/10 overflow-hidden",
          languageFonts[language]
        )}
      >
        <button
          onClick={() => {
            setIsOpen(false);
            router.replace("/");
          }}
          className={cn(
            "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer flex items-center gap-4 hover:bg-accent p-3",
            "transition-colors duration-200",
            isOpen ? "justify-start" : "justify-center"
          )}
        >
          <FileEdit size={22} />
          <span className={isOpen ? "block" : "hidden"}>
            {editor[language]}
          </span>
        </button>
        <button
          onClick={() => {
            setIsOpen(false);
            router.replace("/settings");
          }}
          className={cn(
            "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer flex items-center gap-4 hover:bg-accent p-3",
            "transition-colors duration-200",
            isOpen ? "justify-start" : "justify-center"
          )}
        >
          <Cog size={22} />
          <span className={isOpen ? "block" : "hidden"}>
            {setting[language]}
          </span>
        </button>
        <button
          className={cn(
            "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer flex items-center gap-4 hover:bg-accent p-3",
            "transition-colors duration-200",
            isOpen ? "justify-start" : "justify-center"
          )}
        >
          <LogOut size={22} />
          <span className={isOpen ? "block" : "hidden"}>
            {logout[language]}
          </span>
        </button>
      </div>
    </div>
  );
}
