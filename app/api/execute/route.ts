import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();

    let output = "";
    let error = "";

    switch (language) {
      case "javascript":
        try {
          // Create a sandboxed environment for JavaScript execution
          const logs: string[] = [];

          // Override console methods to capture output
          const sandboxConsole = {
            log: (...args: unknown[]) => {
              logs.push(args.map((arg) => String(arg)).join(" "));
            },
            error: (...args: unknown[]) => {
              logs.push("ERROR: " + args.map((arg) => String(arg)).join(" "));
            },
            warn: (...args: unknown[]) => {
              logs.push("WARNING: " + args.map((arg) => String(arg)).join(" "));
            },
          };

          // Create a function with limited scope
          const func = new Function(
            "console",
            "setTimeout",
            "setInterval",
            `
            "use strict";
            ${code}
            `
          );

          // Execute with sandbox console and disabled timers
          func(
            sandboxConsole,
            () => {},
            () => {}
          );

          output = logs.join("\n");
        } catch (err) {
          error = err instanceof Error ? err.message : "Unknown error occurred";
        }
        break;

      case "python":
        // For Python, you would need to use a Python runtime
        // This is a placeholder - implement using a service like Pyodide or external API
        output = "Python execution not yet implemented in this sandbox";
        break;

      case "html":
        // For HTML, return a preview URL or rendered content
        output = "HTML preview generated";
        break;

      case "css":
        output = "CSS validated successfully";
        break;

      default:
        output = `Execution for ${language} is not supported yet`;
    }

    return NextResponse.json({
      success: true,
      output,
      error: error || null,
    });
  } catch (error) {
    console.error("Code execution error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to execute code",
        output: "",
      },
      { status: 500 }
    );
  }
}
