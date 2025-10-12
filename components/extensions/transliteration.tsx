import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export interface TransliterationOptions {
  font: string;
  language: string;
  apiEndpoint: string;
}

interface TransliterationState {
  active: boolean;
  from: number;
  to: number;
  text: string;
  suggestions: string[];
  selectedIndex: number;
}

const transliterationPluginKey = new PluginKey("transliteration");

export const Transliteration = Extension.create<TransliterationOptions>({
  name: "Transliteration",

  addOptions() {
    return {
      font: "font-anek-kannada",
      language: "kn-t-i0-und",
      apiEndpoint: "https://inputtools.google.com/request",
    };
  },

  addProseMirrorPlugins() {
    const { font, language, apiEndpoint } = this.options;
    let debounceTimer: NodeJS.Timeout | null = null;

    return [
      new Plugin({
        key: transliterationPluginKey,

        state: {
          init(): TransliterationState {
            return {
              active: false,
              from: 0,
              to: 0,
              text: "",
              suggestions: [],
              selectedIndex: 0,
            };
          },

          apply(tr, state) {
            const meta = tr.getMeta(transliterationPluginKey);
            if (meta) {
              return { ...state, ...meta };
            }

            if (tr.docChanged && state.active) {
              return {
                ...state,
                from: tr.mapping.map(state.from),
                to: tr.mapping.map(state.to),
              };
            }

            return state;
          },
        },

        props: {
          decorations(state) {
            const pluginState = transliterationPluginKey.getState(state);
            if (!pluginState?.active) return null;

            const decorations: Decoration[] = [];

            decorations.push(
              Decoration.inline(pluginState.from, pluginState.to, {
                class:
                  "transliteration-active border-b-2 border-white/25 bg-white/5",
              })
            );

            if (pluginState.suggestions.length > 0) {
              const widget = Decoration.widget(
                pluginState.to,
                (view) => {
                  const menu = document.createElement("div");
                  menu.className =
                    "absolute z-[1000] bg-card border border-border rounded-md shadow-lg p-1 min-w-[200px] max-w-[300px]";

                  if (pluginState.to > view.state.doc.content.size) {
                    return menu;
                  }

                  const editorRect = view.dom.getBoundingClientRect();
                  const coords = view.coordsAtPos(pluginState.from);

                  const top = coords.bottom - editorRect.top + 5;
                  const left = coords.left - editorRect.left;

                  menu.style.top = `${top}px`;
                  menu.style.left = `${left}px`;

                  pluginState.suggestions.forEach(
                    (suggestion: string, index: number) => {
                      const item = document.createElement("button");
                      const isSelected = index === pluginState.selectedIndex;
                      item.className = `block w-full text-left text-foreground cursor-pointer rounded px-3 py-2 text-base transition-colors ${font} ${
                        isSelected ? "bg-accent" : "hover:bg-accent"
                      }`;
                      item.textContent = `${index + 1}. ${suggestion}`;

                      item.onmousedown = (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const editorView = (window as any).__tiptapView__;
                        if (editorView) {
                          const tr = editorView.state.tr;

                          const textToInsert = suggestion + " ";

                          tr.insertText(
                            textToInsert,
                            pluginState.from,
                            pluginState.to
                          );

                          const newPos = pluginState.from + textToInsert.length;
                          tr.setSelection(
                            editorView.state.selection.constructor.near(
                              tr.doc.resolve(newPos)
                            )
                          );

                          tr.setMeta(transliterationPluginKey, {
                            active: false,
                            suggestions: [],
                          });

                          editorView.dispatch(tr);
                          editorView.focus();
                        }
                      };

                      menu.appendChild(item);
                    }
                  );

                  return menu;
                },
                { side: 1 }
              );

              decorations.push(widget);
            }

            return DecorationSet.create(state.doc, decorations);
          },

          handleKeyDown(view, event) {
            const state = transliterationPluginKey.getState(view.state);

            if (
              state?.active &&
              (event.key === "Backspace" || event.key === "Delete")
            ) {
              setTimeout(() => {
                const { from, to } = state;
                if (
                  from > view.state.doc.content.size ||
                  to > view.state.doc.content.size + 1
                ) {
                  view.dispatch(
                    view.state.tr.setMeta(transliterationPluginKey, {
                      active: false,
                      suggestions: [],
                    })
                  );
                  return;
                }

                const currentText = view.state.doc.textBetween(
                  from,
                  view.state.doc.content.size
                );

                if (currentText.length < 2) {
                  view.dispatch(
                    view.state.tr.setMeta(transliterationPluginKey, {
                      active: false,
                      suggestions: [],
                    })
                  );
                } else {
                  if (debounceTimer) {
                    clearTimeout(debounceTimer);
                  }

                  debounceTimer = setTimeout(async () => {
                    try {
                      const url = new URL(apiEndpoint);
                      url.searchParams.set("text", currentText);
                      url.searchParams.set("itc", language);
                      url.searchParams.set("num", "5");
                      url.searchParams.set("cp", "0");
                      url.searchParams.set("cs", "1");
                      url.searchParams.set("ie", "utf-8");
                      url.searchParams.set("oe", "utf-8");

                      const response = await fetch(url.toString());
                      const data = await response.json();

                      if (data[0] === "SUCCESS" && data[1] && data[1][0]) {
                        const suggestions = data[1][0][1] || [];

                        const currentState = transliterationPluginKey.getState(
                          view.state
                        );
                        if (
                          currentState?.active &&
                          currentState.text !== currentText
                        ) {
                          view.dispatch(
                            view.state.tr.setMeta(transliterationPluginKey, {
                              ...currentState,
                              text: currentText,
                              suggestions,
                              selectedIndex: 0,
                            })
                          );
                        }
                      }
                    } catch (error) {
                      console.error("Transliteration error:", error);
                    }
                  }, 200);
                }
              }, 0);
            }

            if (!state?.active || state.suggestions.length === 0) return false;

            if (event.key >= "1" && event.key <= "5") {
              const index = parseInt(event.key) - 1;
              if (index < state.suggestions.length) {
                event.preventDefault();
                const suggestion = state.suggestions[index];
                const tr = view.state.tr;
                tr.insertText(suggestion + " ", state.from, state.to);

                const newPos = state.from + suggestion.length + 1;
                tr.setSelection(TextSelection.create(tr.doc, newPos));

                tr.setMeta(transliterationPluginKey, {
                  active: false,
                  suggestions: [],
                });
                view.dispatch(tr);
                return true;
              }
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              const newIndex =
                (state.selectedIndex + 1) % state.suggestions.length;
              view.dispatch(
                view.state.tr.setMeta(transliterationPluginKey, {
                  ...state,
                  selectedIndex: newIndex,
                })
              );
              return true;
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              const newIndex =
                (state.selectedIndex - 1 + state.suggestions.length) %
                state.suggestions.length;
              view.dispatch(
                view.state.tr.setMeta(transliterationPluginKey, {
                  ...state,
                  selectedIndex: newIndex,
                })
              );
              return true;
            }

            if (event.key === "Enter") {
              event.preventDefault();
              const suggestion = state.suggestions[state.selectedIndex];
              const tr = view.state.tr;
              tr.insertText(suggestion + " ", state.from, state.to);

              const newPos = state.from + suggestion.length + 1;
              tr.setSelection(TextSelection.create(tr.doc, newPos));

              tr.setMeta(transliterationPluginKey, {
                active: false,
                suggestions: [],
              });
              view.dispatch(tr);
              return true;
            }

            if (event.key === "Escape") {
              event.preventDefault();
              view.dispatch(
                view.state.tr.setMeta(transliterationPluginKey, {
                  active: false,
                  suggestions: [],
                })
              );
              return true;
            }

            return false;
          },

          handleTextInput(view, from, to, text) {
            (window as any).__tiptapView__ = view;

            if (!/[a-zA-Z\s]/.test(text)) return false;

            const { state } = view;
            const pluginState = transliterationPluginKey.getState(state);

            let wordStart = from;
            const textBefore = state.doc.textBetween(
              Math.max(0, from - 50),
              from
            );
            const match = textBefore.match(/[a-zA-Z]+$/);
            if (match) {
              wordStart = from - match[0].length;
            }

            const currentWord = state.doc.textBetween(wordStart, from) + text;

            if (currentWord.length < 2) {
              view.dispatch(
                state.tr.setMeta(transliterationPluginKey, {
                  active: false,
                  suggestions: [],
                })
              );
              return false;
            }

            if (debounceTimer) {
              clearTimeout(debounceTimer);
            }

            view.dispatch(
              state.tr.setMeta(transliterationPluginKey, {
                active: true,
                from: wordStart,
                to: from + text.length,
                text: currentWord,
                suggestions: pluginState?.suggestions || [],
                selectedIndex: 0,
              })
            );

            debounceTimer = setTimeout(async () => {
              try {
                const url = new URL(apiEndpoint);
                url.searchParams.set("text", currentWord);
                url.searchParams.set("itc", language);
                url.searchParams.set("num", "5");
                url.searchParams.set("cp", "0");
                url.searchParams.set("cs", "1");
                url.searchParams.set("ie", "utf-8");
                url.searchParams.set("oe", "utf-8");

                const response = await fetch(url.toString());
                const data = await response.json();

                if (data[0] === "SUCCESS" && data[1] && data[1][0]) {
                  const suggestions = data[1][0][1] || [];

                  const currentState = transliterationPluginKey.getState(
                    view.state
                  );
                  if (
                    currentState?.active &&
                    currentState.text === currentWord
                  ) {
                    view.dispatch(
                      view.state.tr.setMeta(transliterationPluginKey, {
                        ...currentState,
                        suggestions,
                        selectedIndex: 0,
                      })
                    );
                  }
                }
              } catch (error) {
                console.error("Transliteration error:", error);
              }
            }, 200);

            return false;
          },
        },
      }),
    ];
  },
});
