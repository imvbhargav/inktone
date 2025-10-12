import { useCallback } from "react";
import { Editor } from "@tiptap/react";
import TurndownService from "turndown";

export function useExport(editor: Editor | null) {
  const downloadFile = useCallback(
    (content: string, filename: string, mimeType: string) => {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    []
  );

  const handleExport = useCallback(
    async (format: string) => {
      if (!editor) return;

      const title = "document";
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
    },
    [editor, downloadFile]
  );

  const handlePrint = useCallback(() => {
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
  }, []);

  return { handleExport, handlePrint };
}
