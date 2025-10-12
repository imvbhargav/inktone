import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Dropcursor } from "@tiptap/extensions";
import { createLowlight } from "lowlight";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { CustomImage } from "@/components/extensions/custom-image";

const lowlight = createLowlight();

const editorPluginsArray: any[] = [
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
];

export const getEditorExtensions = () => editorPluginsArray;
