import { useState, useCallback } from "react";
import { Editor } from "@tiptap/react";

export function useEditorCommands(editor: Editor | null) {
  const deleteSlash = useCallback(() => {
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
    const searchTerm = textBefore.slice(lastSlash + 1);
    const tr = state.tr.delete(
      slashDocPos,
      slashDocPos + searchTerm.length + 1
    );
    view.dispatch(tr);
    view.focus();
  }, [editor]);

  const wrap = useCallback(
    (cmd: () => void) => () => {
      deleteSlash();
      cmd();
    },
    [deleteSlash]
  );

  return { deleteSlash, wrap };
}
