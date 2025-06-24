import React from "react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export default function Gradbg() {
  return (
    <div className="fixed inset-0 z-[-10] flex items-center justify-center opacity-90 bg-black">
      <TextHoverEffect text="duocode" duration={5} />
    </div>
  );
}
