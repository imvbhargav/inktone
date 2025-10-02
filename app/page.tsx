"use client";

import NotionLikeEditor from "@/components/editor";

export default function Home() {
  return (
    <div className="font-sans h-full w-full print:h-auto">
      <main className="h-full w-full print:h-auto">
        <NotionLikeEditor />
      </main>
    </div>
  );
}
