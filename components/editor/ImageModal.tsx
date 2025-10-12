"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageModalProps } from "@/types/editor";

export function ImageModal({ show, onClose, onInsert }: ImageModalProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [imageType, setImageType] = useState<"url" | "upload">("url");
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  if (!show) return null;

  const handleInsert = () => {
    onInsert({
      url: imageUrl,
      file: imageFile || undefined,
      altText,
      caption,
    });

    // Reset state
    setImageUrl("");
    setImageFile(null);
    setAltText("");
    setCaption("");
    setImageType("url");
  };

  const handleCancel = () => {
    setImageUrl("");
    setImageFile(null);
    setAltText("");
    setCaption("");
    setImageType("url");
    onClose();
  };

  return (
    <div
      onClick={handleCancel}
      className="fixed inset-0 flex items-center justify-center z-[99999] backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card p-6 rounded-md w-md border border-card-foreground/10 flex flex-col gap-2"
      >
        <h2 className="text-lg font-semibold mb-2">Insert Image</h2>
        <div className="flex gap-2 mb-2">
          <Button
            variant={imageType === "url" ? "secondary" : "ghost"}
            disabled={imageType === "url"}
            onClick={() => setImageType("url")}
            className="cursor-pointer rounded"
          >
            From URL
          </Button>
          <Button
            variant={imageType === "upload" ? "secondary" : "ghost"}
            onClick={() => setImageType("upload")}
            disabled={imageType === "upload"}
            className="cursor-pointer rounded"
          >
            Upload Image
          </Button>
        </div>
        {imageType === "url" ? (
          <input
            type="text"
            placeholder="Enter Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border rounded p-2 text-sm"
          />
        ) : (
          <>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <Button
              onClick={() => imageInputRef.current?.click()}
              variant={"outline"}
              className="cursor-pointer w-full h-46 rounded border-dashed flex items-center justify-center"
              style={{
                backgroundImage: imageFile
                  ? `url(${URL.createObjectURL(imageFile)})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <span
                className={cn(
                  "backdrop-blur-sm rounded px-2 py-1 border border-card-foreground/10 bg-card/50",
                  imageFile && "mix-blend-difference text-white"
                )}
              >
                + {imageFile ? "Replace" : "Upload"}
              </span>
            </Button>
          </>
        )}
        <input
          type="text"
          placeholder="Alt text (for accessibility)"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="w-full border rounded p-2 text-sm mt-2"
        />
        <input
          type="text"
          placeholder="Optional caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border rounded p-2 text-sm"
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="cursor-pointer rounded"
          >
            Cancel
          </Button>
          <Button className="cursor-pointer rounded" onClick={handleInsert}>
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
}
