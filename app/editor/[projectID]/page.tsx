"use client";

import "../editor.css";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Split from "react-split";
import dynamic from "next/dynamic";
import {
  Play,
  Save,
  Download,
  Settings,
  FileText,
  FolderOpen,
  Plus,
  X,
  Code,
  Terminal as TerminalIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Editor from "@/components/Editor";
import { TerminalRef } from "@/components/Terminal";

const Terminalx = dynamic(() => import("@/components/Terminal"), {
  ssr: false,
});

interface FileEntry {
  id: string;
  name: string;
  content: string;
  language: string;
}

interface ProjectData {
  id: string;
  name: string;
  files: FileEntry[];
}

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectID = params.projectID as string;
  const terminalRef = useRef<TerminalRef>(null);

  const [project, setProject] = useState<ProjectData | null>(null);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        // Try to load from API first
        const response = await fetch(`/api/projects/${projectID}`);
        if (response.ok) {
          const projectData = await response.json();
          setProject(projectData);
          setActiveFileId(projectData.files[0]?.id);
        } else {
          // Fallback to sample project
          const sampleProject: ProjectData = {
            id: projectID,
            name: `Project ${projectID}`,
            files: [
              {
                id: "1",
                name: "index.js",
                content: `// Welcome to your sandbox code editor!
console.log("Hello, World!");

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));

// Try editing this code and running it
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled numbers:", doubled);`,
                language: "javascript",
              },
              {
                id: "2",
                name: "styles.css",
                content: `/* CSS Styles for your project */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0;
  padding: 20px;
  color: white;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}`,
                language: "css",
              },
              {
                id: "3",
                name: "index.html",
                content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sandbox Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to Your Sandbox!</h1>
        <p>This is a sample HTML file. Edit the code and see your changes!</p>
        <div id="output"></div>
    </div>
    <script src="index.js"></script>
</body>
</html>`,
                language: "html",
              },
            ],
          };

          setProject(sampleProject);
          setActiveFileId(sampleProject.files[0].id);
        }
      } catch (error) {
        console.error("Failed to load project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectID]);

  const activeFile = project?.files.find((f) => f.id === activeFileId);

  const handleContentChange = (content: string) => {
    if (!activeFileId || !project) return;

    setProject((prev) => ({
      ...prev!,
      files: prev!.files.map((file) =>
        file.id === activeFileId ? { ...file, content } : file
      ),
    }));
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!project || !activeFile) return;

    try {
      const response = await fetch(`/api/projects/${projectID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        setUnsavedChanges(false);
        terminalRef.current?.writeOutput(
          "\x1b[1;32m✓ Project saved successfully!\x1b[0m"
        );
      } else {
        terminalRef.current?.writeOutput(
          "\x1b[1;31m✗ Failed to save project\x1b[0m"
        );
      }
    } catch (error) {
      console.error("Failed to save:", error);
      terminalRef.current?.writeOutput(
        "\x1b[1;31m✗ Save error: " + error + "\x1b[0m"
      );
    }
  };

  const handleRun = async () => {
    if (!activeFile || isRunning) return;

    setIsRunning(true);
    terminalRef.current?.writeOutput(
      `\x1b[1;36m🚀 Running ${activeFile.name}...\x1b[0m`
    );

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: activeFile.content,
          language: activeFile.language,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.output) {
          terminalRef.current?.writeOutput("\x1b[1;33m📤 Output:\x1b[0m");
          terminalRef.current?.writeOutput(result.output);
        }
        if (result.error) {
          terminalRef.current?.writeOutput("\x1b[1;31m❌ Error:\x1b[0m");
          terminalRef.current?.writeOutput(result.error);
        }
      } else {
        terminalRef.current?.writeOutput(
          "\x1b[1;31m❌ Execution failed: " + result.error + "\x1b[0m"
        );
      }
    } catch (error) {
      terminalRef.current?.writeOutput(
        "\x1b[1;31m❌ Network error: " + error + "\x1b[0m"
      );
    } finally {
      setIsRunning(false);
      terminalRef.current?.writeOutput("");
    }
  };

  const handleNewFile = () => {
    if (!newFileName.trim() || !project) return;

    const newFile: FileEntry = {
      id: Date.now().toString(),
      name: newFileName,
      content: getDefaultContent(newFileName),
      language: getLanguageFromFileName(newFileName),
    };

    setProject((prev) => ({
      ...prev!,
      files: [...prev!.files, newFile],
    }));

    setActiveFileId(newFile.id);
    setNewFileName("");
    setShowNewFileDialog(false);
  };

  const getDefaultContent = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "js":
        return (
          '// New JavaScript file\nconsole.log("Hello from " + "' +
          fileName +
          '");'
        );
      case "html":
        return "<!DOCTYPE html>\n<html>\n<head>\n    <title>New Page</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>";
      case "css":
        return "/* New CSS file */\nbody {\n    margin: 0;\n    padding: 20px;\n    font-family: Arial, sans-serif;\n}";
      case "py":
        return '# New Python file\nprint("Hello from ' + fileName + '")';
      default:
        return "";
    }
  };

  const getLanguageFromFileName = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      html: "html",
      css: "css",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      json: "json",
      md: "markdown",
    };
    return languageMap[ext || ""] || "plaintext";
  };

  const handleDownload = () => {
    if (!activeFile) return;

    const blob = new Blob([activeFile.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Project not found</p>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold truncate" title={project.name}>
              {project.name}
            </h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => router.push("/dashboard")}
            >
              <X size={16} />
            </Button>
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={() => setShowNewFileDialog(true)}
          >
            <Plus size={16} className="mr-2" />
            New File
          </Button>
        </div>

        <div className="flex-1 p-2">
          <div className="space-y-1">
            {project.files.map((file) => (
              <div
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-700 ${
                  activeFileId === file.id ? "bg-blue-600" : ""
                }`}
              >
                <FileText size={16} className="mr-2 text-gray-400" />
                <span className="text-sm truncate">{file.name}</span>
                {activeFileId === file.id && unsavedChanges && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full ml-auto"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            {activeFile && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {activeFile.language}
                </Badge>
                <span className="text-sm font-medium">{activeFile.name}</span>
                {unsavedChanges && (
                  <Badge variant="destructive" className="text-xs">
                    Unsaved
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              disabled={!unsavedChanges}
            >
              <Save size={16} className="mr-1" />
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? (
                <Loader2 size={16} className="mr-1 animate-spin" />
              ) : (
                <Play size={16} className="mr-1" />
              )}
              Run
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDownload}>
              <Download size={16} className="mr-1" />
              Download
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowTerminal(!showTerminal)}
            >
              <TerminalIcon size={16} className="mr-1" />
              Terminal
            </Button>
          </div>
        </div>

        {/* Editor and Terminal */}
        <div className="flex-1">
          <Split
            className="flex flex-col h-full"
            sizes={showTerminal ? [70, 30] : [100]}
            direction="vertical"
            gutterSize={showTerminal ? 4 : 0}
            minSize={showTerminal ? [200, 100] : [200]}
          >
            <div className="bg-gray-900">
              {activeFile ? (
                <Editor
                  key={activeFile.id}
                  filePath={activeFile.name}
                  fileContent={activeFile.content}
                  onContentChange={handleContentChange}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Code size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Select a file to start editing</p>
                  </div>
                </div>
              )}
            </div>
            {showTerminal && (
              <div className="bg-black">
                <Terminalx ref={terminalRef} />
              </div>
            )}
          </Split>
        </div>
      </div>

      {/* New File Dialog */}
      {showNewFileDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Create New File</h3>
            <Input
              placeholder="Enter file name (e.g., script.js, style.css)"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleNewFile()}
              className="mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowNewFileDialog(false);
                  setNewFileName("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleNewFile} disabled={!newFileName.trim()}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
