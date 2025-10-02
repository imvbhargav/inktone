"use client";

import React, { JSX, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { CustomImage } from "./extensions/custom-image";
import Heading from "@tiptap/extension-heading";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Dropcursor } from "@tiptap/extensions";
import { createLowlight } from "lowlight";
import {
  TextStyle,
  Color,
  BackgroundColor,
} from "@tiptap/extension-text-style";
import {
  Heading1,
  Heading2,
  Type,
  List,
  CheckSquare,
  Quote,
  Code,
  Image as ImageIcon,
  Minus,
  Bold,
  Italic,
  Strikethrough,
  Link2,
  Heading6,
  Heading5,
  Heading4,
  Heading3,
  HeadingIcon,
  ListOrdered,
  UnderlineIcon,
  Upload, // <-- Added Export Icon
} from "lucide-react";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TurndownService from "turndown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";

interface NotionLikeEditorProps {
  initialContent?: string;
  onSave?: (data: { html: string; json: object }) => void;
}

const lowlight = createLowlight();

const ICONS: Record<string, JSX.Element> = {
  h: <HeadingIcon size={18} />,
  h1: <Heading1 size={18} />,
  h2: <Heading2 size={18} />,
  h3: <Heading3 size={18} />,
  h4: <Heading4 size={18} />,
  h5: <Heading5 size={18} />,
  h6: <Heading6 size={18} />,
  p: <Type size={18} />,
  bullet: <List size={18} />,
  ordered: <ListOrdered size={18} />,
  todo: <CheckSquare size={18} />,
  blockquote: <Quote size={18} />,
  code: <Code size={18} />,
  image: <ImageIcon size={18} />,
  hr: <Minus size={18} />,
};

export default function NotionLikeEditor({
  initialContent = "",
  onSave,
}: NotionLikeEditorProps) {
  const [showCommand, setShowCommand] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHeadings, setShowHeadings] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [menuCoords, setMenuCoords] = useState<{
    left: number;
    top: number;
  } | null>(null);

  const EXPORT_OPTIONS = [
    { id: "print", label: "Print / PDF" },
    { id: "md", label: "Markdown (.md)" },
    { id: "html", label: "HTML (.html)" },
    { id: "txt", label: "Plain Text (.txt)" },
    { id: "json", label: "JSON (.json)" },
  ];

  const downloadFile = (
    content: string,
    filename: string,
    mimeType: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = async (format: string) => {
    if (!editor) return;

    const title = "document"; // You could derive this from the first h1 tag if you want
    const timestamp = new Date().toISOString();
    const filename = `${title}-${timestamp}`;

    switch (format) {
      case "html": {
        const htmlContent = editor.getHTML();
        downloadFile(htmlContent, `${filename}.html`, "text/html");
        break;
      }
      case "md": {
        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(editor.getHTML());
        downloadFile(markdown, `${filename}.md`, "text/markdown");
        break;
      }
      case "txt": {
        const text = editor.getText();
        downloadFile(text, `${filename}.txt`, "text/plain");
        break;
      }
      case "json": {
        const json = JSON.stringify(editor.getJSON(), null, 2);
        downloadFile(json, `${filename}.json`, "application/json");
        break;
      }
    }
  };

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        codeBlock: false,
      }),
      Link.configure({ openOnClick: false }),
      Underline,
      CustomImage,
      Heading,
      TaskList,
      TaskItem,
      Blockquote,
      Dropcursor,
      TextStyle,
      Color,
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({
        placeholder: "Type '/' at the beginning for commands… ",
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
    ],
    immediatelyRender: false,
    content: initialContent || "",
  });

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        color: ctx.editor?.getAttributes("textStyle").color,
      };
    },
  });

  const menuRef = useRef<HTMLDivElement | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [imageType, setImageType] = useState<"url" | "upload">("url");

  const [title, setTitle] = useState("");

  const deleteSlash = () => {
    if (!editor) return;
    const { state, view } = editor;
    const { $from } = state.selection;
    const textBefore = $from.parent.textBetween(
      0,
      $from.parentOffset,
      undefined
    );
    const lastSlash = textBefore.lastIndexOf("/");
    if (lastSlash < 0) return;
    const parentStart = $from.start();
    const slashDocPos = parentStart + lastSlash;
    const tr = state.tr.delete(
      slashDocPos,
      slashDocPos + searchTerm.length + 1
    );
    view.dispatch(tr);
    view.focus();
  };

  const resetMenu = () => {
    setSearchTerm("");
    setShowCommand(false);
    setShowHeadings(false);
    setMenuCoords(null);
  };

  const wrap = (cmd: () => void) => () => {
    deleteSlash();
    cmd();
    resetMenu();
  };

  const HEADINGS = [
    {
      id: "h1",
      label: "Heading 1",
      run: wrap(() =>
        editor?.chain().focus().toggleHeading({ level: 1 }).run()
      ),
    },
    {
      id: "h2",
      label: "Heading 2",
      run: wrap(() =>
        editor?.chain().focus().toggleHeading({ level: 2 }).run()
      ),
    },
    {
      id: "h3",
      label: "Heading 3",
      run: wrap(() =>
        editor?.chain().focus().toggleHeading({ level: 3 }).run()
      ),
    },
    {
      id: "h4",
      label: "Heading 4",
      run: wrap(() =>
        editor?.chain().focus().toggleHeading({ level: 4 }).run()
      ),
    },
    {
      id: "h5",
      label: "Heading 5",
      run: wrap(() =>
        editor?.chain().focus().toggleHeading({ level: 5 }).run()
      ),
    },
    {
      id: "h6",
      label: "Heading 6",
      run: wrap(() =>
        editor?.chain().focus().toggleHeading({ level: 6 }).run()
      ),
    },
  ];

  const COMMANDS = [
    {
      id: "h",
      label: "Heading",
      run: () => {
        setShowHeadings((s) => !s);
        setSelectedIndex(0);
      },
    },
    {
      id: "p",
      label: "Paragraph",
      run: wrap(() => editor?.chain().focus().setParagraph().run()),
    },
    {
      id: "bullet",
      label: "Bullet List",
      run: wrap(() => editor?.chain().focus().toggleBulletList().run()),
    },
    {
      id: "ordered",
      label: "Ordered List",
      run: wrap(() => editor?.chain().focus().toggleOrderedList().run()),
    },
    {
      id: "todo",
      label: "To-do",
      run: wrap(() => editor?.chain().focus().toggleTaskList().run()),
    },
    {
      id: "blockquote",
      label: "Blockquote",
      run: wrap(() => editor?.chain().focus().toggleBlockquote().run()),
    },
    {
      id: "code",
      label: "Code Block",
      run: wrap(() => editor?.chain().focus().toggleCodeBlock().run()),
    },
    {
      id: "image",
      label: "Image",
      run: wrap(() => setShowImageModal(true)),
    },
    {
      id: "hr",
      label: "Horizontal Rule",
      run: wrap(() => editor?.chain().focus().setHorizontalRule().run()),
    },
  ];

  const filteredCommands =
    searchTerm.length > 0
      ? [...COMMANDS.slice(1, COMMANDS.length), ...HEADINGS].filter((c) =>
          c.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : COMMANDS.filter((c) =>
          c.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

  useEffect(() => {
    if (!editor) return;

    const onTransaction = () => {
      if (!editor) return;
      const { state, view } = editor;
      const { $from } = state.selection;
      const textBefore = $from.parent.textBetween(
        0,
        $from.parentOffset,
        undefined,
        "￼"
      );
      const lastSlash = textBefore.lastIndexOf("/");

      if (lastSlash >= 0) {
        const after = textBefore.slice(lastSlash + 1);

        if (
          $from.parent.textContent.trim() === "/" ||
          $from.parent.textContent.trim().startsWith("/")
        ) {
          setSearchTerm(after);
          setShowCommand(true);

          try {
            const parentStart = $from.start();
            const slashDocPos = parentStart + lastSlash;
            const coords = view.coordsAtPos(slashDocPos + 1);

            const menuHeight = menuRef.current?.offsetHeight ?? 400;
            const spaceBelow = window.innerHeight - coords.bottom;
            const spaceAbove = coords.top;

            if (spaceBelow < menuHeight) {
              setMenuCoords({
                left: coords.left,
                top:
                  menuHeight < spaceAbove
                    ? coords.top - menuHeight + 25
                    : coords.top - (menuHeight - spaceAbove),
              });
            } else {
              setMenuCoords({ left: coords.left, top: coords.bottom + 8 });
            }
          } catch {}
        } else {
          resetMenu();
        }
      } else {
        resetMenu();
      }
    };

    editor.on("transaction", onTransaction);
    return () => {
      editor.off("transaction", onTransaction);
    };
  }, [editor]);

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
          cmdLength = HEADINGS.length;
        }
        setSelectedIndex((s) => Math.min(cmdLength - 1, s + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((s) => Math.max(0, s - 1));
      }
      if (e.key === "Enter") {
        const cmd = showHeadings
          ? HEADINGS[selectedIndex]
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
      }
    };

    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [showCommand, filteredCommands, selectedIndex]);

  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      const target = ev.target as Node | null;
      if (!target) return;
      if (menuRef.current?.contains(target)) return;
      if (editor && editor.view.dom.contains(target)) return;
      resetMenu();
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [editor]);

  useEffect(() => {
    if (selectedIndex >= filteredCommands.length) setSelectedIndex(0);
  }, [filteredCommands.length, selectedIndex]);

  const handleInsertImage = async () => {
    if (!editor) return;

    let finalUrl = "";
    if (imageFile) {
      finalUrl = URL.createObjectURL(imageFile);
    } else if (imageUrl.trim()) {
      finalUrl = imageUrl.trim();
    }

    if (finalUrl) {
      editor
        .chain()
        .focus()
        .setImage({
          src: finalUrl,
          alt: altText,
          caption: caption,
        })
        .run();
    }

    setShowImageModal(false);
    setImageFile(null);
    setImageUrl("");
    setAltText("");
    setCaption("");
  };

  const handlePrint = () => {
    const printArea = document.getElementById("print-area");
    const editor = document.querySelector(".ProseMirror");
    const body = document.body;
    const html = document.documentElement;

    if (!printArea) return;

    const originalStyles = {
      printAreaHeight: printArea.style.height,
      printAreaOverflow: printArea.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
    };

    printArea.style.cssText +=
      "height: auto !important; overflow: visible !important; max-height: none !important;";
    if (editor) {
      (editor as HTMLElement).style.cssText +=
        "height: auto !important; overflow: visible !important;";
    }
    body.style.cssText +=
      "overflow: visible !important; height: auto !important;";
    html.style.cssText +=
      "overflow: visible !important; height: auto !important;";

    setTimeout(() => {
      window.print();

      setTimeout(() => {
        printArea.style.height = originalStyles.printAreaHeight;
        printArea.style.overflow = originalStyles.printAreaOverflow;
        body.style.overflow = originalStyles.bodyOverflow;
        html.style.overflow = originalStyles.htmlOverflow;
      }, 100);
    }, 250);
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-2 md:px-4 border-b flex flex-col-reverse items-end md:flex-row justify-end print:justify-start print:items-start gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Document"
          className="mt-4 md:mt-0 md:text-lg rounded bg-transparent dark:bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-foreground/10 focus:ring-foreground/10 font-semibold w-full px-1 font-anek-latin print:hidden"
        ></Input>
        <h1 className="text-4xl font-bold hidden print:block">{title}</h1>{" "}
        <div className="w-full flex justify-end items-center p-2 md:p-0 print:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded cursor-pointer flex items-center gap-2">
                <Upload size={16} /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="cursor-pointer font-sans"
              align="end"
            >
              {EXPORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  className="cursor-pointer font-sans"
                  key={option.id}
                  onClick={() => {
                    if (option.id === "print") {
                      handlePrint();
                    } else {
                      handleExport(option.id);
                    }
                  }}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden p-4 print:overflow-visible print:h-auto">
        {editor && (
          <>
            <BubbleMenu
              editor={editor}
              options={{ placement: "bottom", offset: 8, flip: true }}
            >
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
                      color: editorState?.color || "",
                    }}
                    className="absolute underline decoration-2 font-black"
                  >
                    A
                  </span>
                  <input
                    type="color"
                    value={editorState?.color ?? ""}
                    onInput={(event) =>
                      editor
                        .chain()
                        .focus()
                        .setColor(event.currentTarget.value)
                        .run()
                    }
                    data-testid="setColor"
                    className="h-full w-8 rounded-full border-0 m-0 cursor-pointer opacity-0"
                  />
                </Button>
              </div>
            </BubbleMenu>
            {showCommand && menuCoords && (
              <div
                ref={menuRef}
                style={{
                  position: "fixed",
                  left: menuCoords.left,
                  top: menuCoords.top,
                  zIndex: 9999,
                }}
              >
                <div className="flex flex-col items-start bg-card rounded-md border border-card-foreground/10 divide-y divide-card-foreground/10 relative w-56 shadow">
                  {showHeadings && (
                    <div className="w-48 absolute top-22 right-4 md:top-0 md:-right-50 rounded-md border border-card-foreground/10 z-50 bg-card shadow overflow-hidden">
                      {HEADINGS.map((cmd, i) => (
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
                      onClick={resetMenu}
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
                        onClick={cmd.run}
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
            )}
            <div
              id="print-area"
              className="w-full flex justify-center h-full overflow-y-scroll scrollbar-hide print:h-auto print:overflow-visible print:block"
            >
              <EditorContent
                className="print:h-auto h-full w-full max-w-5xl font-anek-latin prose-custom dark:prose-invert prose-img:border prose-img:rounded-md prose-figure:my-4 prose-figcaption:text-center prose-figcaption:text-muted-foreground prose-figcaption:mt-2 prose-code:font-mono [&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:m-0 [&_ul[data-type=taskList]>li]:flex [&_ul[data-type=taskList]>li]:items-center [&_ul[data-type=taskList]>li_label]:mr-2 [&_ul[data-type=taskList]>li_label]:flex [&_ul[data-type=taskList]>li_label]:items-center [&_ul[data-type=taskList]_input[type=checkbox]]:w-4 [&_ul[data-type=taskList]_input[type=checkbox]]:h-4 [&_ul[data-type=taskList]_input[type=checkbox]]:accent-neutral-600 dark:[&_ul[data-type=taskList]_input[type=checkbox]]:accent-neutral-200"
                editor={editor}
              />
            </div>
          </>
        )}
      </div>
      {showImageModal && (
        <div
          onClick={(e) => setShowImageModal(false)}
          className="fixed inset-0 flex items-center justify-center z-[99999] backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card p-6 rounded-md w-md border border-card-foreground/10 flex flex-col gap-2"
          >
            <h2 className="text-lg font-semibold mb-2">Insert Image</h2>
            <div className="flex gap-2 mb-2">
              <Button
                variant={imageType === "url" ? "secondary" : "ghost"}
                disabled={imageType === "url"}
                onClick={() => setImageType("url")}
                className="cursor-pointer rounded"
              >
                From URL
              </Button>
              <Button
                variant={imageType === "upload" ? "secondary" : "ghost"}
                onClick={() => setImageType("upload")}
                disabled={imageType === "upload"}
                className="cursor-pointer rounded"
              >
                Upload Image
              </Button>
            </div>
            {imageType === "url" ? (
              <input
                type="text"
                placeholder="Enter Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full border rounded p-2 text-sm"
              />
            ) : (
              <>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Button
                  onClick={() => imageInputRef.current?.click()}
                  variant={"outline"}
                  className="cursor-pointer w-full h-46 rounded border-dashed flex items-center justify-center"
                  style={{
                    backgroundImage: imageFile
                      ? `url(${URL.createObjectURL(imageFile)})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <span
                    className={cn(
                      "backdrop-blur-sm rounded px-2 py-1 border border-card-foreground/10 bg-card/50",
                      imageFile && "mix-blend-difference text-white"
                    )}
                  >
                    + {imageFile ? "Replace" : "Upload"}
                  </span>
                </Button>
              </>
            )}
            <input
              type="text"
              placeholder="Alt text (for accessibility)"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full border rounded p-2 text-sm mt-2"
            />
            <input
              type="text"
              placeholder="Optional caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border rounded p-2 text-sm"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowImageModal(false);
                  setImageFile(null);
                  setImageUrl("");
                  setAltText("");
                  setCaption("");
                }}
                className="cursor-pointer rounded"
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer rounded"
                onClick={handleInsertImage}
              >
                Insert
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
