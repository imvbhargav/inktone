"use client";

import InktoneEditor from "@/components/InktoneEditor";

export default function Home() {
  return (
    <div className="font-sans h-full w-full print:h-auto">
      <main className="h-full w-full print:h-auto">
        <InktoneEditor />
      </main>
    </div>
  );
}
