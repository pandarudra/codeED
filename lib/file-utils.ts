import crypto from "crypto";
import path from "path";

export function generateB2Key(
  workspaceId: string,
  folderPath: string,
  fileName: string
): string {
  return `workspaces/${workspaceId}/${folderPath}/${fileName}`.replace(
    /\/+/g,
    "/"
  );
}

export function calculateChecksum(buffer: Buffer): string {
  return crypto.createHash("md5").update(buffer).digest("hex");
}

export function getFileType(extension: string): string {
  const typeMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    html: "html",
    css: "css",
    scss: "scss",
    sass: "sass",
    json: "json",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    md: "markdown",
    txt: "text",
    sh: "shell",
    dockerfile: "dockerfile",
    sql: "sql",
    php: "php",
    java: "java",
    cpp: "cpp",
    c: "c",
    go: "go",
    rs: "rust",
    rb: "ruby",
  };

  return typeMap[extension.toLowerCase()] || "other";
}

export function getMimeType(extension: string): string {
  const mimeMap: Record<string, string> = {
    js: "application/javascript",
    jsx: "application/javascript",
    ts: "application/typescript",
    tsx: "application/typescript",
    py: "text/x-python",
    html: "text/html",
    css: "text/css",
    scss: "text/x-scss",
    sass: "text/x-sass",
    json: "application/json",
    xml: "application/xml",
    yaml: "application/x-yaml",
    yml: "application/x-yaml",
    md: "text/markdown",
    txt: "text/plain",
  };

  return mimeMap[extension.toLowerCase()] || "text/plain";
}
