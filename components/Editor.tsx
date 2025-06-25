"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function Editor({
  filePath,
  fileContent,
  onContentChange,
}: {
  filePath?: string;
  fileContent?: string;
  onContentChange?: (content: string) => void;
}) {
  const [value, setValue] = useState(fileContent || "");

  return (
    <div className="h-full">
      <Monaco
        height="100%"
        defaultLanguage="javascript"
        path={filePath}
        value={value}
        onChange={(v) => {
          setValue(v ?? "");
          onContentChange?.(v ?? "");
        }}
        theme="vs-dark"
      />
    </div>
  );
}
