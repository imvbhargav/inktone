import { JSX } from "react";
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
  Heading6,
  Heading5,
  Heading4,
  Heading3,
  HeadingIcon,
  ListOrdered,
  Printer,
  ArrowUpDown,
  CodeXml,
  FileText,
  Braces,
} from "lucide-react";

export const ICONS: Record<string, JSX.Element> = {
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

export const EXPORT_OPTIONS = [
  { id: "print", icon: <Printer />, label: "Print / PDF" },
  { id: "md", icon: <ArrowUpDown />, label: "Markdown (.md)" },
  { id: "html", icon: <CodeXml />, label: "HTML (.html)" },
  { id: "txt", icon: <FileText />, label: "Plain Text (.txt)" },
  { id: "json", icon: <Braces />, label: "JSON (.json)" },
];
