"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

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

  // Update value when fileContent changes (switching between files)
  useEffect(() => {
    setValue(fileContent || "");
  }, [fileContent]);

  // Determine language from file extension
  const getLanguage = (path?: string): string => {
    if (!path) return "javascript";

    const extension = path.split(".").pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      html: "html",
      htm: "html",
      css: "css",
      scss: "scss",
      sass: "sass",
      less: "less",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      cs: "csharp",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
      json: "json",
      xml: "xml",
      md: "markdown",
      sql: "sql",
      sh: "shell",
      bash: "shell",
      yml: "yaml",
      yaml: "yaml",
    };

    return languageMap[extension || ""] || "plaintext";
  };

  const handleEditorChange = (content: string | undefined) => {
    const newContent = content ?? "";
    setValue(newContent);
    onContentChange?.(newContent);
  };

  return (
    <div className="h-full">
      <Monaco
        height="100%"
        language={getLanguage(filePath)}
        path={filePath}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderLineHighlight: "all",
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: "line",
          tabSize: 2,
          insertSpaces: true,
          folding: true,
          foldingStrategy: "auto",
          showFoldingControls: "always",
          bracketPairColorization: {
            enabled: true,
          },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          quickSuggestions: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
}
