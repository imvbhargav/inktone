"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { NotionLikeEditorProps, ImageData } from "../types/editor";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { BubbleMenuBar } from "@/components/editor/BubbleMenuBar";
import { CommandMenu } from "@/components/editor/CommandMenu";
import { ImageModal } from "@/components/editor/ImageModal";
import { EXPORT_OPTIONS } from "@/constants/editor";
import { getEditorExtensions } from "@/config/editorConfig";
import { useEditorCommands } from "@/hooks/useEditorCommands";
import { useCommandMenu } from "@/hooks/useCommandMenu";
import { useExport } from "@/hooks/useExport";
import { useKeyboardHandler } from "@/hooks/useKeyboardHandler";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useSelectedIndex } from "@/hooks/useSelectedIndex";
import { useAutoSave } from "@/hooks/useAutoSave";
import {
  createHeadingCommands,
  createMainCommands,
  filterCommands,
} from "@/utils/editorCommands";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/store/language";
import { Transliteration } from "./extensions/transliteration";
import { Placeholder } from "@tiptap/extensions";
import { languageFonts, languagePlaceholders } from "@/constants/i18n";
import { usePosts } from "@/store/posts";

export default function InktoneEditor({
  initialContent = null,
  onSave,
}: NotionLikeEditorProps) {
  const [extensions, setExtenstions] = useState(getEditorExtensions());
  const [showImageModal, setShowImageModal] = useState(false);
  const [title, setTitle] = useState("");
  const { language } = useLanguage();
  const { open_post } = usePosts();

  useEffect(() => {
    setTitle(open_post?.title ?? "");
  }, [open_post]);

  useEffect(() => {
    let extensions_to_add = [];
    if (language !== "en") {
      extensions_to_add.push(
        Transliteration.configure({
          font: languageFonts[language],
          language: `${language}-t-i0-und`,
          apiEndpoint: "https://inputtools.google.com/request",
        })
      );
    }

    extensions_to_add.push(
      Placeholder.configure({
        placeholder: languagePlaceholders[language],
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      })
    );

    setExtenstions([...getEditorExtensions(), ...extensions_to_add]);
  }, [language]);

  const editor = useEditor(
    {
      extensions: extensions,
      immediatelyRender: false,
      content: initialContent ?? open_post?.content ?? "",
    },
    [extensions]
  );

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        color: ctx.editor?.getAttributes("textStyle").color,
      };
    },
  });

  // Auto-save hook - saves content automatically as user types
  useAutoSave({ editor, title, delay: 1000 });

  const { wrap } = useEditorCommands(editor);
  const {
    showCommand,
    searchTerm,
    showHeadings,
    selectedIndex,
    menuCoords,
    menuRef,
    setShowHeadings,
    setSelectedIndex,
    resetMenu,
    closeMenu,
  } = useCommandMenu(editor);

  const { handleExport, handlePrint } = useExport(editor);

  const HEADINGS = createHeadingCommands(editor, wrap);
  const COMMANDS = createMainCommands(
    editor,
    wrap,
    () => {
      setShowHeadings((s) => !s);
      setSelectedIndex(0);
    },
    () => setShowImageModal(true)
  );

  const filteredCommands = filterCommands(COMMANDS, HEADINGS, searchTerm);
  if (filteredCommands.length === 0) closeMenu();

  useKeyboardHandler({
    showCommand,
    showHeadings,
    filteredCommands,
    headings: HEADINGS,
    selectedIndex,
    setShowHeadings,
    setSelectedIndex,
    resetMenu,
    closeMenu,
  });

  useClickOutside(menuRef, editor, resetMenu);
  useSelectedIndex(filteredCommands.length, selectedIndex, setSelectedIndex);

  const handleInsertImage = (data: ImageData) => {
    if (!editor) return;

    let finalUrl = "";
    if (data.file) {
      finalUrl = URL.createObjectURL(data.file);
    } else if (data.url?.trim()) {
      finalUrl = data.url.trim();
    }

    if (finalUrl) {
      editor
        .chain()
        .focus()
        .setImage({
          src: finalUrl,
          alt: data.altText,
          caption: data.caption,
        })
        .run();
    }

    setShowImageModal(false);
  };

  return (
    <div className="h-full w-full flex flex-col">
      <EditorToolbar
        title={title}
        onTitleChange={setTitle}
        onExport={handleExport}
        onPrint={handlePrint}
        exportOptions={EXPORT_OPTIONS}
      />

      <div className="relative flex-1 overflow-hidden p-4 print:overflow-visible print:h-auto">
        {editor && (
          <>
            <BubbleMenu
              editor={editor}
              options={{ placement: "bottom", offset: 8, flip: true }}
            >
              <BubbleMenuBar editor={editor} color={editorState?.color} />
            </BubbleMenu>

            <CommandMenu
              show={showCommand}
              coords={menuCoords}
              searchTerm={searchTerm}
              selectedIndex={selectedIndex}
              showHeadings={showHeadings}
              filteredCommands={filteredCommands}
              headings={HEADINGS}
              onClose={resetMenu}
              onCommandClick={(cmd) => cmd.run()}
            />

            <div
              id="print-area"
              className="w-full flex justify-center h-full overflow-y-scroll scrollbar-hide print:h-auto print:overflow-visible print:block"
            >
              <EditorContent
                className={cn(
                  "print:h-auto h-full w-full max-w-5xl prose-custom dark:prose-invert prose-img:border prose-img:rounded-md prose-figure:my-4 prose-figcaption:text-center prose-figcaption:text-muted-foreground prose-figcaption:mt-2 prose-code:font-mono [&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:m-0 [&_ul[data-type=taskList]>li]:flex [&_ul[data-type=taskList]>li]:items-center [&_ul[data-type=taskList]>li_label]:mr-2 [&_ul[data-type=taskList]>li_label]:flex [&_ul[data-type=taskList]>li_label]:items-center [&_ul[data-type=taskList]_input[type=checkbox]]:w-4 [&_ul[data-type=taskList]_input[type=checkbox]]:h-4 [&_ul[data-type=taskList]_input[type=checkbox]]:accent-neutral-600 dark:[&_ul[data-type=taskList]_input[type=checkbox]]:accent-neutral-200",
                  language === "kn" && "font-anek-kannada",
                  language === "bn" && "font-anek-bengali",
                  language === "en" && "font-anek-english"
                )}
                editor={editor}
              />
            </div>
          </>
        )}
      </div>

      <ImageModal
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        onInsert={handleInsertImage}
      />
    </div>
  );
}
