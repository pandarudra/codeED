"use client";

import { useState, useEffect } from "react";

interface FileEntry {
  name: string;
  path: string;
  isDirectory: boolean;
}

export default function Sidebar({
  onSelect,
}: {
  onSelect: (f: FileEntry) => void;
}) {
  const [files, setFiles] = useState<FileEntry[]>([]);

  useEffect(() => {
    // TODO: Replace with fetch call to /api/files
    setFiles([{ name: "index.js", path: "/index.js", isDirectory: false }]);
  }, []);

  return (
    <aside className="w-64 bg-gray-100 border-r overflow-auto">
      {files.map((f) => (
        <div
          key={f.path}
          className="p-2 cursor-pointer hover:bg-gray-200"
          onClick={() => onSelect(f)}
        >
          {f.isDirectory ? "📁" : "📄"} {f.name}
        </div>
      ))}
    </aside>
  );
}
