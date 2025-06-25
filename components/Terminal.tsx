"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import "xterm/css/xterm.css";

export default function Terminalx() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = new Terminal();
    const fit = new FitAddon();
    term.loadAddon(fit);
    if (ref.current) {
      term.open(ref.current);
      fit.fit();
      term.writeln("Terminal ready.");
    }
    window.addEventListener("resize", fit.fit);
    return () => {
      window.removeEventListener("resize", fit.fit);
      term.dispose();
    };
  }, []);

  return <div ref={ref} className="w-full h-full" />;
}
