import { useEffect } from "react";
import { Command } from "../types/editor";

interface UseKeyboardHandlerProps {
  showCommand: boolean;
  showHeadings: boolean;
  filteredCommands: Command[];
  headings: Command[];
  selectedIndex: number;
  setShowHeadings: (show: boolean | ((prev: boolean) => boolean)) => void;
  setSelectedIndex: (index: number | ((prev: number) => number)) => void;
  resetMenu: () => void;
  closeMenu: () => void;
}

export function useKeyboardHandler({
  showCommand,
  showHeadings,
  filteredCommands,
  headings,
  selectedIndex,
  setShowHeadings,
  setSelectedIndex,
  resetMenu,
  closeMenu,
}: UseKeyboardHandlerProps) {
  useEffect(() => {
    if (!showCommand) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Tab") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]?.id === "h") {
          setShowHeadings(true);
          setSelectedIndex(0);
        }
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (showHeadings) {
          setShowHeadings(false);
          setSelectedIndex(0);
        }
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        let cmdLength = filteredCommands.length;
        if (showHeadings) {
          cmdLength = headings.length;
        }
        setSelectedIndex((s) => Math.min(cmdLength - 1, s + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((s) => Math.max(0, s - 1));
      }
      if (e.key === "Enter") {
        const cmd = showHeadings
          ? headings[selectedIndex]
          : filteredCommands[selectedIndex];
        if (cmd) {
          e.preventDefault();
          e.stopPropagation();
          cmd.run();
        }
        setSelectedIndex(0);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        if (showHeadings) {
          setShowHeadings(false);
        } else resetMenu();
        closeMenu();
      }
    };

    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [
    showCommand,
    filteredCommands,
    selectedIndex,
    showHeadings,
    headings,
    setShowHeadings,
    setSelectedIndex,
    resetMenu,
  ]);
}
