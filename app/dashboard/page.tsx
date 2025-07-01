"use client";

import { useState } from "react";
import { Code, FileText, Bell, Trash2, ExternalLink, Play } from "lucide-react";
import LandingBG from "@/components/LandingBG";
import { useRouter } from "next/navigation";

// Types matching your MongoDB schemas
type File = {
  _id: string;
  name: string;
  extension: string;
  type: string;
  size: number;
  path: string;
  parentFolderId: string;
  createdAt: Date;
  updatedAt: Date;
};

type Folder = {
  _id: string;
  name: string;
  path: string;
  parentFolderId?: string | null;
  parentWorkspaceId: string;
  createdAt: Date;
  updatedAt: Date;
};

type Workspace = {
  _id: string;
  name: string;
  description?: string;
  parentUserId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default function DashboardPage() {
  const [activeSidebar, setActiveSidebar] = useState("code");
  const [activeTab, setActiveTab] = useState("recent");
  const [showModal, setShowModal] = useState({ open: false, type: "none" });
  const [spaceName, setSpaceName] = useState("");
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Sidebar navigation handler
  const handleSidebarClick = (menu: string) => {
    setActiveSidebar(menu);
    setActiveTab(
      menu === "code" ? "recent" : menu === "file" ? "starred" : "workspace"
    );
  };

  // Load workspaces from MongoDB
  const loadWorkspaces = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to fetch workspaces
      const response = await fetch("/api/workspaces");
      const data = await response.json();
      setWorkspaces(data);
    } catch (error) {
      console.error("Error loading workspaces:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load folders for a workspace
  const loadFolders = async (workspaceId: string) => {
    try {
      // TODO: Implement API call to fetch folders for workspace
      // const response = await fetch(`/api/workspaces/${workspaceId}/folders`);
      // const data = await response.json();
      // setFolders(data);
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  // Load files for a folder
  const loadFiles = async (folderId: string) => {
    try {
      // TODO: Implement API call to fetch files for folder
      // const response = await fetch(`/api/folders/${folderId}/files`);
      // const data = await response.json();
      // setFiles(data);
    } catch (error) {
      console.error("Error loading files:", error);
    }
  };

  // Create new workspace
  const handleCreateWorkspace = async () => {
    const name = spaceName.trim();
    if (!name) {
      alert("Please enter a valid workspace name.");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement workspace creation
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: "" }),
      });
      const newWorkspace = await response.json();
      setWorkspaces((prev) => [...prev, newWorkspace]);

      console.log("Creating workspace:", name);
    } catch (error) {
      console.error("Error creating workspace:", error);
      alert("Failed to create workspace");
    } finally {
      setLoading(false);
      setShowModal({ open: false, type: "none" });
      setSpaceName("");
    }
  };

  // Create new folder
  const handleCreateFolder = async () => {
    const name = spaceName.trim();
    if (!name || !selectedWorkspaceId) {
      alert("Please enter a valid folder name and select a workspace.");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement folder creation
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          parentWorkspaceId: selectedWorkspaceId,
          parentFolderId: selectedFolderId,
        }),
      });
      const newFolder = await response.json();
      setFolders((prev) => [...prev, newFolder]);

      console.log(
        "Creating folder:",
        name,
        "in workspace:",
        selectedWorkspaceId
      );
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Failed to create folder");
    } finally {
      setLoading(false);
      setShowModal({ open: false, type: "none" });
      setSpaceName("");
    }
  };

  // Handle create action based on modal type
  const handleCreateSpace = async () => {
    if (showModal.type === "workspace") {
      await handleCreateWorkspace();
    } else if (showModal.type === "folder") {
      await handleCreateFolder();
    }
  };

  // Delete workspace
  const handleDeleteWorkspace = async (workspaceId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this workspace? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement workspace deletion (soft delete)
      // const response = await fetch(`/api/workspaces/${workspaceId}`, {
      //   method: 'DELETE'
      // });
      // if (response.ok) {
      //   setWorkspaces(prev => prev.filter(ws => ws._id !== workspaceId));
      // }

      console.log("Deleting workspace:", workspaceId);
    } catch (error) {
      console.error("Error deleting workspace:", error);
      alert("Failed to delete workspace");
    } finally {
      setLoading(false);
    }
  };

  // Open workspace in editor
  const handleOpenInEditor = (workspaceId: string) => {
    router.push(`/editor/${workspaceId}`);
  };

  // Handle workspace selection
  const handleWorkspaceSelect = async (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    await loadFolders(workspaceId);
  };

  // Handle folder selection
  const handleFolderSelect = async (folderId: string) => {
    setSelectedFolderId(folderId);
    await loadFiles(folderId);
  };

  // Get folders for selected workspace
  const getWorkspaceFolders = (workspaceId: string) => {
    return folders.filter(
      (folder) =>
        folder.parentWorkspaceId === workspaceId &&
        folder.parentFolderId === null
    );
  };

  // Get files count for workspace
  const getWorkspaceFileCount = (workspaceId: string) => {
    const workspaceFolders = folders.filter(
      (folder) => folder.parentWorkspaceId === workspaceId
    );
    const folderIds = workspaceFolders.map((f) => f._id);
    return files.filter((file) => folderIds.includes(file.parentFolderId))
      .length;
  };

  return (
    <div className="min-h-screen flex text-white relative">
      <div className="fixed inset-0 -z-10 w-full h-full">
        <LandingBG />
      </div>

      {/* Sidebar */}
      <aside className="w-20 backdrop-blur bg-white/5 border-r border-white/10 flex flex-col items-center py-6 space-y-6">
        {[
          { icon: Code, id: "code" },
          { icon: FileText, id: "file" },
          { icon: Bell, id: "bell" },
        ].map(({ icon: Icon, id }) => (
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
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-10">
        <h1 className="text-3xl font-semibold mb-8 text-white drop-shadow-lg">
          Dashboard
        </h1>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          {[
            { id: "recent", label: "Recent Files" },
            { id: "starred", label: "Starred Files" },
            { id: "workspace", label: "Workspaces" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveSidebar(
                  tab.id === "recent"
                    ? "code"
                    : tab.id === "starred"
                    ? "file"
                    : "bell"
                );
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        )}

        {/* Workspace Tab Content */}
        {activeTab === "workspace" && !loading && (
          <div className="space-y-6">
            {workspaces.map((ws) => {
              const workspaceFolders = getWorkspaceFolders(ws._id);
              const fileCount = getWorkspaceFileCount(ws._id);

              return (
                <div
                  key={ws._id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h2
                        className="text-xl font-semibold text-blue-100 cursor-pointer hover:text-blue-300"
                        onClick={() => handleWorkspaceSelect(ws._id)}
                      >
                        {ws.name}
                      </h2>
                      {ws.description && (
                        <span className="text-sm text-gray-400">
                          - {ws.description}
                        </span>
                      )}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenInEditor(ws._id)}
                          className="flex items-center text-sm bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-white transition-colors"
                          title="Open in Editor"
                        >
                          <Play size={14} className="mr-1" />
                          Open Editor
                        </button>
                        <button
                          onClick={() => handleOpenInEditor(ws._id)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="Open in new tab"
                        >
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20 disabled:opacity-50"
                        onClick={() => {
                          setSelectedWorkspaceId(ws._id);
                          setShowModal({ open: true, type: "folder" });
                        }}
                        disabled={loading}
                      >
                        + Add Folder
                      </button>
                      <button
                        onClick={() => handleDeleteWorkspace(ws._id)}
                        className="text-red-400 hover:text-red-600 disabled:opacity-50"
                        disabled={loading}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Workspace Stats */}
                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-400">
                    <span>{workspaceFolders.length} folders</span>
                    <span>{fileCount} files</span>
                    <span
                      className={
                        ws.isPublic ? "text-blue-400" : "text-green-400"
                      }
                    >
                      ● {ws.isPublic ? "Public" : "Private"}
                    </span>
                    <span className="text-xs">
                      Created {new Date(ws.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Folder List */}
                  <div className="pl-4 mt-2 space-y-2">
                    {workspaceFolders.map((folder) => (
                      <div
                        key={folder._id}
                        onClick={() => handleFolderSelect(folder._id)}
                        className={`cursor-pointer px-2 py-1 rounded hover:bg-white/10 transition ${
                          selectedFolderId === folder._id
                            ? "bg-blue-700 text-white"
                            : ""
                        }`}
                      >
                        📁 {folder.name} ({folder.path})
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {workspaces.length === 0 && (
              <div className="text-center py-12">
                <Code className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">
                  No workspaces yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first workspace to start coding
                </p>
                <button
                  onClick={() =>
                    setShowModal({ open: true, type: "workspace" })
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                  disabled={loading}
                >
                  Create Workspace
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recent Files Tab */}
        {activeTab === "recent" && !loading && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              Recent Files
            </h3>
            <p className="text-gray-500">
              Your recently accessed files will appear here
            </p>
          </div>
        )}

        {/* Starred Files Tab */}
        {activeTab === "starred" && !loading && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              Starred Files
            </h3>
            <p className="text-gray-500">Your starred files will appear here</p>
          </div>
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-3 z-50">
        <button
          className="bg-gray-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg border border-white/10 text-sm font-medium disabled:opacity-50"
          onClick={() => setShowModal({ open: true, type: "folder" })}
          disabled={loading || !selectedWorkspaceId}
        >
          Create Folder
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg border border-white/10 text-sm font-medium disabled:opacity-50"
          onClick={() => setShowModal({ open: true, type: "workspace" })}
          disabled={loading}
        >
          Create Workspace
        </button>
      </div>

      {/* Modal */}
      {showModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Create New{" "}
              {showModal.type === "workspace" ? "Workspace" : "Folder"}
            </h2>
            <input
              type="text"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              placeholder={`Enter ${showModal.type} name...`}
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white placeholder:text-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowModal({ open: false, type: "none" })}
                className="px-4 py-2 rounded-md bg-white/10 text-gray-300 hover:bg-white/20 disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSpace}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                disabled={loading || !spaceName.trim()}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
