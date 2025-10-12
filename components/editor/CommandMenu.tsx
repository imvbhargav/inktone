"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CommandMenuProps } from "@/types/editor";
import { ICONS } from "@/constants/editor";

export function CommandMenu({
  show,
  coords,
  searchTerm,
  selectedIndex,
  showHeadings,
  filteredCommands,
  headings,
  onClose,
  onCommandClick,
}: CommandMenuProps) {
  if (!show || !coords) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: coords.left,
        top: coords.top,
        zIndex: 9999,
      }}
    >
      <div className="flex flex-col items-start bg-card rounded-md border border-card-foreground/10 divide-y divide-card-foreground/10 relative w-56 shadow">
        {showHeadings && (
          <div className="w-48 absolute top-22 right-4 md:top-0 md:-right-50 rounded-md border border-card-foreground/10 z-50 bg-card shadow overflow-hidden">
            {headings.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={cmd.run}
                className={cn(
                  "hover:bg-accent px-4 py-2 w-full text-sm flex items-center gap-4 cursor-pointer",
                  showHeadings && i === selectedIndex && "bg-accent"
                )}
              >
                {ICONS[cmd.id]} {cmd.label}
              </button>
            ))}
          </div>
        )}
        <div className="px-3 py-2 flex justify-between">
          <input
            value={searchTerm}
            readOnly
            placeholder="Type after / to filter"
            className="w-full text-sm bg-transparent outline-none"
          />
          <button
            onClick={onClose}
            className="py-1 px-2 border border-foreground/10 rounded-md text-xs"
          >
            Esc
          </button>
        </div>
        <div className="overflow-hidden w-full">
          {filteredCommands.length === 0 && (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              No commands
            </div>
          )}
          {filteredCommands.map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={() => onCommandClick(cmd)}
              className={cn(
                "hover:bg-accent px-4 py-2 w-full text-sm flex items-center gap-4 cursor-pointer",
                !showHeadings && i === selectedIndex && "bg-accent"
              )}
            >
              {ICONS[cmd.id]} {cmd.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
