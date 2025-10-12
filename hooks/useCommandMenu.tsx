import { useState, useEffect, useRef, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { MenuCoords } from "@/types/editor";

export function useCommandMenu(editor: Editor | null) {
  const [showCommand, setShowCommand] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHeadings, setShowHeadings] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [menuCoords, setMenuCoords] = useState<MenuCoords | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const manuallyClosedRef = useRef(false);
  const lastSlashPosRef = useRef<number | null>(null);

  const resetMenu = useCallback(() => {
    setSearchTerm("");
    setShowCommand(false);
    setShowHeadings(false);
    setMenuCoords(null);
    manuallyClosedRef.current = false;
  }, []);

  const closeMenu = useCallback(() => {
    setSearchTerm("");
    setShowCommand(false);
    setShowHeadings(false);
    setMenuCoords(null);
    manuallyClosedRef.current = true;
  }, []);

  useEffect(() => {
    if (!editor) return;

    const onTransaction = () => {
      if (!editor) return;

      const { state } = editor;
      const { $from } = state.selection;

      const textBefore = $from.parent.textBetween(
        0,
        $from.parentOffset,
        undefined,
        "￼"
      );
      const lastSlash = textBefore.lastIndexOf("/");

      if (lastSlash < 0) {
        if (showCommand) {
          resetMenu();
        }
        lastSlashPosRef.current = null;
        return;
      }

      const parentStart = $from.start();
      const currentSlashPos = parentStart + lastSlash;

      if (lastSlashPosRef.current !== currentSlashPos) {
        manuallyClosedRef.current = false;
        lastSlashPosRef.current = currentSlashPos;
      }

      if (manuallyClosedRef.current) {
        return;
      }

      const after = textBefore.slice(lastSlash + 1);
      setSearchTerm(after);
      setShowCommand(true);

      try {
        const { view } = editor;
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
    };

    editor.on("transaction", onTransaction);
    return () => {
      editor.off("transaction", onTransaction);
    };
  }, [editor, showCommand, resetMenu]);

  return {
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
  };
}
