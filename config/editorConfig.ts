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
import Underline from "@tiptap/extension-underline";
import { CustomImage } from "@/components/extensions/custom-image";

// Import language grammars
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import php from "highlight.js/lib/languages/php";
import ruby from "highlight.js/lib/languages/ruby";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import bash from "highlight.js/lib/languages/bash";

const lowlight = createLowlight();

// Register languages
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("python", python);
lowlight.register("java", java);
lowlight.register("cpp", cpp);
lowlight.register("csharp", csharp);
lowlight.register("php", php);
lowlight.register("ruby", ruby);
lowlight.register("go", go);
lowlight.register("rust", rust);
lowlight.register("sql", sql);
lowlight.register("json", json);
lowlight.register("xml", xml);
lowlight.register("html", xml);
lowlight.register("css", css);
lowlight.register("bash", bash);

const editorPluginsArray: any[] = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3, 4, 5, 6] },
    codeBlock: false,
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    linkOnPaste: true,
  }),
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
