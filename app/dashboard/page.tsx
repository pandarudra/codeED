"use client";

import { useState } from "react";
import { Code, FileText, Bell } from "lucide-react";
import LandingBG from "@/components/LandingBG";

export default function DashboardPage() {
  const [activeSidebar, setActiveSidebar] = useState("code");
  const [activeTab, setActiveTab] = useState("recent");

  const handleSidebarClick = (menu: string) => {
    setActiveSidebar(menu);
    if (menu === "code") setActiveTab("recent");
    else if (menu === "file") setActiveTab("starred");
    else if (menu === "bell") setActiveTab("workspace");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] via-[#0c1222] to-[#00040f] text-white">
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

        {/* Tab Switcher (optional) */}
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

        {/* Tab Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "recent" && (
            <>
              <Card title="index.tsx" subtitle="Last updated 2 hours ago" />
              <Card title="main.js" subtitle="Updated 1 day ago" />
              <Card title="auth.ts" subtitle="Updated just now" />
            </>
          )}

          {activeTab === "starred" && (
            <>
              <Card title="dashboard.jsx" subtitle="Starred last week" />
              <Card title="api-routes.js" subtitle="Pinned file" />
            </>
          )}

          {activeTab === "workspace" && (
            <>
              <Card title="Next.js Project" subtitle="4 files • React" />
              <Card title="Tailwind Starter" subtitle="2 files • Styled" />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function Card({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur rounded-xl p-5 shadow-md hover:shadow-blue-500/10 transition">
      <h2 className="text-lg font-semibold text-blue-100 mb-1">{title}</h2>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </div>
  );
}
