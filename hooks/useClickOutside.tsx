import { useEffect, RefObject } from "react";
import { Editor } from "@tiptap/react";

export function useClickOutside(
  menuRef: RefObject<HTMLDivElement | null>,
  editor: Editor | null,
  resetMenu: () => void
) {
  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      const target = ev.target as Node | null;
      if (!target) return;
      if (menuRef?.current?.contains(target)) return;
      if (editor && editor.view.dom.contains(target)) return;
      resetMenu();
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [editor, menuRef, resetMenu]);
}
