import { Editor } from "@tiptap/react";
import { Command } from "../types/editor";

export function createHeadingCommands(
  editor: Editor | null,
  wrap: (cmd: () => void) => () => void
): Command[] {
  return [
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
}

export function createMainCommands(
  editor: Editor | null,
  wrap: (cmd: () => void) => () => void,
  onShowHeadings: () => void,
  onShowImageModal: () => void
): Command[] {
  return [
    {
      id: "h",
      label: "Heading",
      run: onShowHeadings,
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
      run: wrap(onShowImageModal),
    },
    {
      id: "hr",
      label: "Horizontal Rule",
      run: wrap(() => editor?.chain().focus().setHorizontalRule().run()),
    },
  ];
}

export function filterCommands(
  commands: Command[],
  headings: Command[],
  searchTerm: string
): Command[] {
  return searchTerm.length > 0
    ? [...commands.slice(1), ...headings].filter((c) =>
        c.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : commands.filter((c) =>
        c.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
}
