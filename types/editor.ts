import { Editor } from "@tiptap/react";

export interface NotionLikeEditorProps {
  initialContent?: string | null;
  onSave?: (data: { html: string; json: object }) => void;
}

export interface Command {
  id: string;
  label: string;
  run: () => void;
}

export interface MenuCoords {
  left: number;
  top: number;
}

export interface ExportOption {
  id: string;
  icon: any;
  label: string;
}

export interface ImageModalProps {
  show: boolean;
  onClose: () => void;
  onInsert: (data: ImageData) => void;
}

export interface ImageData {
  url?: string;
  file?: File;
  altText: string;
  caption: string;
}

export interface BubbleMenuBarProps {
  editor: Editor;
  color?: string;
}

export interface CommandMenuProps {
  show: boolean;
  coords: MenuCoords | null;
  searchTerm: string;
  selectedIndex: number;
  showHeadings: boolean;
  filteredCommands: Command[];
  headings: Command[];
  onClose: () => void;
  onCommandClick: (cmd: Command) => void;
}

export interface EditorToolbarProps {
  title: string;
  onTitleChange: (title: string) => void;
  onExport: (format: string) => void;
  onPrint: () => void;
  exportOptions: ExportOption[];
}
