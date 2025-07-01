"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import "xterm/css/xterm.css";

export interface TerminalRef {
  writeOutput: (output: string) => void;
  clear: () => void;
}

const Terminalx = forwardRef<TerminalRef>((props, ref) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<Terminal | null>(null);

  useImperativeHandle(ref, () => ({
    writeOutput: (output: string) => {
      if (terminal) {
        terminal.writeln(output);
      }
    },
    clear: () => {
      if (terminal) {
        terminal.clear();
      }
    },
  }));

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      theme: {
        background: "#1a1a1a",
        foreground: "#ffffff",
        cursor: "#ffffff",
        selection: "#3366ff",
      },
      fontSize: 14,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      cursorBlink: true,
      rows: 20,
      cols: 80,
    });

    const fit = new FitAddon();
    term.loadAddon(fit);

    term.open(terminalRef.current);
    fit.fit();

    // Welcome message
    term.writeln(
      "\x1b[1;32m╭─────────────────────────────────────────╮\x1b[0m"
    );
    term.writeln("\x1b[1;32m│     Welcome to CodeED Sandbox Terminal │\x1b[0m");
    term.writeln(
      "\x1b[1;32m╰─────────────────────────────────────────╯\x1b[0m"
    );
    term.writeln(
      '\x1b[1;36mClick "Run" to execute your code and see output here.\x1b[0m'
    );
    term.writeln("");

    // Handle terminal input
    term.onData((data) => {
      if (data === "\r") {
        term.write("\r\n");
      } else {
        term.write(data);
      }
    });

    setTerminal(term);

    // Handle window resize
    const handleResize = () => {
      fit.fit();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      term.dispose();
    };
  }, []);

  return (
    <div className="h-full w-full bg-gray-900 p-2">
      <div className="h-full w-full border border-gray-700 rounded">
        <div ref={terminalRef} className="w-full h-full" />
      </div>
    </div>
  );
});

Terminalx.displayName = "Terminalx";

export default Terminalx;
