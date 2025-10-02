// @/components/custom-image.ts

import { Node, mergeAttributes } from "@tiptap/core";

export interface CustomImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customImage: {
      setImage: (options: {
        src: string;
        alt?: string;
        caption?: string;
      }) => ReturnType;
    };
  }
}

export const CustomImage = Node.create<CustomImageOptions>({
  name: "customImage",
  group: "block",
  content: "inline*", // This allows the caption to have formatting like bold, links, etc.
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) =>
          element.querySelector("img")?.getAttribute("src"),
      },
      alt: {
        default: null,
        parseHTML: (element) =>
          element.querySelector("img")?.getAttribute("alt"),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-type="custom-image"]',
        contentElement: "figcaption",
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "figure",
      { "data-type": "custom-image" },
      [
        "img",
        mergeAttributes(HTMLAttributes, {
          src: node.attrs.src,
          alt: node.attrs.alt,
        }),
      ],
      ["figcaption", 0], // The '0' is a "content hole" for the caption text.
    ];
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
              alt: options.alt,
            },
            content: options.caption
              ? [{ type: "text", text: options.caption }]
              : [],
          });
        },
    };
  },
});
