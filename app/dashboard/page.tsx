"use client";

import { useState } from "react";
import { Code, FileText, Bell, Trash2 } from "lucide-react";
import LandingBG from "@/components/LandingBG";
import { v4 as uuidv4 } from "uuid";

// Types

type File = {
  id: string;
  name: string;
};

type Folder = {
  id: string;
  name: string;
  files: File[];
};

type Workspace = {
  id: string;
  name: string;
  folders: Folder[];
};

export default function DashboardPage() {
  const [activeSidebar, setActiveSidebar] = useState("code");
  const [activeTab, setActiveTab] = useState("recent");
  const [showModal, setShowModal] = useState({ open: false, type: "none" });
  const [spaceName, setSpaceName] = useState("");
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const handleSidebarClick = (menu: string) => {
    setActiveSidebar(menu);
    setActiveTab(menu === "code" ? "recent" : menu === "file" ? "starred" : "workspace");
  };

  const handleCreateSpace = async () => {
    const name = spaceName.trim();
    if (!name) {
      alert("Please enter a valid name.");
      return;
    }

    const id = uuidv4();

    if (showModal.type === "workspace") {
      try {
        const formData = new FormData();
        formData.append("file", new Blob(["initialize workspace"], { type: "text/plain" }), ".init");
        formData.append("folder", id); // UUID as folder name

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        console.log(`Created workspace folder: ${id}/.init`);
      } catch (err) {
        console.error("Error uploading to B2 via backend:", err);
        alert("Failed to create workspace in B2");
        return;
      }

      const newWorkspace: Workspace = {
        id,
        name,
        folders: [],
      };
      setWorkspaces((prev) => [...prev, newWorkspace]);
    }

    setShowModal({ open: false, type: "none" });
    setSpaceName("");
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: workspaceId }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setWorkspaces((prev) => prev.filter((ws) => ws.id !== workspaceId));
    } catch (err) {
      console.error("Error deleting from B2:", err);
      alert("Failed to delete workspace from B2");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedWorkspaceId || !selectedFolderId) {
      alert("Select a workspace and folder before uploading files.");
      return;
    }

    const workspace = workspaces.find((ws) => ws.id === selectedWorkspaceId);
    const folder = workspace?.folders.find((f) => f.id === selectedFolderId);
    if (!workspace || !folder) return;

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", `${workspace.id}/${folder.name}`);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        setWorkspaces((prev) =>
          prev.map((ws) =>
            ws.id === workspace.id
              ? {
                  ...ws,
                  folders: ws.folders.map((f) =>
                    f.id === folder.id
                      ? {
                          ...f,
                          files: [...f.files, { id: uuidv4(), name: file.name }],
                        }
                      : f
                  ),
                }
              : ws
          )
        );
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    e.target.value = "";
  };

  return (
    <div className="min-h-screen flex text-white relative">
      <div className="fixed inset-0 -z-10 w-full h-full">
        <LandingBG />
      </div>
      <aside className="w-20 backdrop-blur bg-white/5 border-r border-white/10 flex flex-col items-center py-6 space-y-6">
        {[{ icon: Code, id: "code" }, { icon: FileText, id: "file" }, { icon: Bell, id: "bell" }].map(
          ({ icon: Icon, id }) => (
            <button
              key={id}
              onClick={() => handleSidebarClick(id)}
              className={`p-2 rounded-lg transition ${
                activeSidebar === id
                  ? "bg-blue-600 shadow-md shadow-blue-500/30"
                  : "hover:bg-white/10"
              }`}
            >
              <Icon className="w-6 h-6 text-white" />
            </button>
          )
        )}
      </aside>

      <main className="flex-1 px-8 py-10">
        <h1 className="text-3xl font-semibold mb-8 text-white drop-shadow-lg">Dashboard</h1>
        <div className="flex space-x-4 mb-8">
          {[{ id: "recent", label: "Recent Files" }, { id: "starred", label: "Starred Files" }, { id: "workspace", label: "Workspaces" }].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveSidebar(tab.id === "recent" ? "code" : tab.id === "starred" ? "file" : "bell");
              }}
              className={`px-5 py-2 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white/5 border border-white/10 text-blue-100 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "workspace" && (
          <div className="space-y-6">
            {workspaces.map((ws) => (
              <div key={ws.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <h2
                    className="text-xl font-semibold text-blue-100 cursor-pointer"
                    onClick={() => setSelectedWorkspaceId(ws.id)}
                  >
                    {ws.name}
                  </h2>
                  <div className="flex items-center gap-3">
                    <button
                      className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20"
                      onClick={() => {
                        setSelectedWorkspaceId(ws.id);
                        setShowModal({ open: true, type: "folder" });
                      }}
                    >
                      + Add Folder
                    </button>
                    <button
                      onClick={() => handleDeleteWorkspace(ws.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="pl-4 mt-2 space-y-2">
                  {ws.folders.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFolderId(f.id)}
                      className={`cursor-pointer px-2 py-1 rounded hover:bg-white/10 ${
                        selectedFolderId === f.id ? "bg-blue-700 text-white" : ""
                      }`}
                    >
                      📁 {f.name} ({f.files.length} files)
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-3 z-50">
        <input type="file" multiple onChange={handleFileUpload} className="hidden" id="uploadInput" />
        <label htmlFor="uploadInput" className="cursor-pointer bg-white/10 hover:bg-white/20 text-blue-100 px-4 py-2 rounded-lg shadow-lg border border-white/10 text-sm font-medium">
          ⬆️ Upload Files
        </label>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg border border-white/10 text-sm font-medium"
          onClick={() => setShowModal({ open: true, type: "workspace" })}
        >
          ➕ Create Workspace
        </button>
      </div>

      {showModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Create New {showModal.type === "workspace" ? "Workspace" : "Folder"}
            </h2>
            <input
              type="text"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              placeholder={`Enter ${showModal.type} name...`}
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white placeholder:text-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowModal({ open: false, type: "none" })}
                className="px-4 py-2 rounded-md bg-white/10 text-gray-300 hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSpace}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="bg-white/5 border border-white/60 backdrop-blur rounded p-5 shadow-md hover:shadow-blue-500/10 transition">
      <h2 className="text-lg font-semibold text-blue-100 mb-1">{title}</h2>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </div>
  );
}
