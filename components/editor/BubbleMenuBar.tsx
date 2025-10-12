"use client";

import React from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Link2,
  UnderlineIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BubbleMenuBarProps } from "@/types/editor";

export function BubbleMenuBar({ editor, color }: BubbleMenuBarProps) {
  return (
    <div className="bg-card ring-1 ring-accent shadow rounded-md flex divide-x divide-card-foreground/10 overflow-hidden">
      <Button
        size="sm"
        variant="ghost"
        title="Bold (Ctrl + b)"
        className={cn("cursor-pointer rounded-none")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={18} />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        title="Italic (Ctrl + i)"
        className={cn("cursor-pointer rounded-none")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={18} />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        title="Underline (Ctrl + Alt + u)"
        className={cn("cursor-pointer rounded-none")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={18} />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        title="Strikethrough (Ctrl + Alt + s)"
        className={cn("cursor-pointer rounded-none")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={18} />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        title="Link (Ctrl + Alt + l)"
        className={cn("cursor-pointer rounded-none")}
        onClick={() => editor.chain().focus().toggleLink().run()}
      >
        <Link2 size={18} />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className={cn("relative cursor-pointer rounded-none p-0")}
      >
        <span
          style={{
            color: color || "",
          }}
          className="absolute underline decoration-2 font-black"
        >
          A
        </span>
        <input
          type="color"
          value={color ?? ""}
          onInput={(event) =>
            editor.chain().focus().setColor(event.currentTarget.value).run()
          }
          data-testid="setColor"
          className="h-full w-8 rounded-full border-0 m-0 cursor-pointer opacity-0"
        />
      </Button>
    </div>
  );
}
