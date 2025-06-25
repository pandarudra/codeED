"use client";

import Split from "react-split";

// import dynamic from "next/dynamic";
// import Sidebar from "@/components/Sidebar";
import Editor from "@/components/Editor";

// const Terminalx = dynamic(() => import("@/components/Terminal"), {
//   ssr: false,
// });

export default function EditorPage() {
  return (
    <div className="flex h-screen">
      {/* <Sidebar onSelect={() => console.log("selected")} /> */}

      <Split
        className="flex flex-col flex-1"
        sizes={[70, 30]}
        direction="vertical"
        gutterSize={4}
      >
        <Editor />
        {/* <Terminalx /> */}
      </Split>
    </div>
  );
}
