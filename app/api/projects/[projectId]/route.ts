import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/mongodb";
import { Project } from "@/models/project";
import { v4 as uuidv4 } from "uuid";

// Get project data for the editor
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const projectId = params.projectId;

    // Try to find existing project
    let project = await Project.findOne({
      id: projectId,
      parentUserId: session.user.email,
    }).exec();

    // If no project found, create a sample project
    if (!project) {
      const newProject = await Project.create({
        id: projectId,
        name: `Project ${projectId.slice(0, 8)}`,
        workspaceId: projectId,
        parentUserId: session.user.email,
        files: [
          {
            id: uuidv4(),
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
console.log("Doubled numbers:", doubled);

// You can create more files using the + button
// Supported languages: JavaScript, HTML, CSS, Python, and more!`,
            language: "javascript",
            path: "/index.js",
            size: 0,
            lastModified: new Date(),
          },
          {
            id: uuidv4(),
            name: "styles.css",
            content: `/* CSS Styles for your project */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0;
  padding: 20px;
  color: white;
  min-height: 100vh;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
}

h1 {
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-size: 2.5rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}`,
            language: "css",
            path: "/styles.css",
            size: 0,
            lastModified: new Date(),
          },
          {
            id: uuidv4(),
            name: "index.html",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeED Sandbox Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to Your Sandbox!</h1>
        <p>This is your personal code playground. Edit any file and see your changes!</p>
        
        <div class="feature-grid">
            <div class="feature-card">
                <h3>📝 Code Editor</h3>
                <p>VS Code-like experience with syntax highlighting and IntelliSense</p>
            </div>
            <div class="feature-card">
                <h3>⚡ Live Execution</h3>
                <p>Run JavaScript code instantly and see output in the terminal</p>
            </div>
            <div class="feature-card">
                <h3>📁 File Management</h3>
                <p>Create, edit, and organize multiple files in your project</p>
            </div>
        </div>
        
        <div id="output" style="margin-top: 30px; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 8px;">
            <p>JavaScript output will appear here when you run your code!</p>
        </div>
    </div>
    <script src="index.js"></script>
</body>
</html>`,
            language: "html",
            path: "/index.html",
            size: 0,
            lastModified: new Date(),
          },
        ],
        tags: ["sandbox", "starter"],
      });

      project = newProject;
    }

    // Convert to plain object for response
    const projectData = {
      id: project.id,
      name: project.name,
      description: project.description,
      files: project.files.map((file) => ({
        id: file.id,
        name: file.name,
        content: file.content,
        language: file.language,
      })),
    };

    return NextResponse.json(projectData);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

interface FileData {
  id: string;
  name: string;
  content: string;
  language: string;
}

interface ProjectUpdateData {
  name: string;
  description?: string;
  files: FileData[];
}

// Save project data
export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const projectId = params.projectId;
    const projectData: ProjectUpdateData = await request.json();

    // Update or create project
    const updatedProject = await Project.findOneAndUpdate(
      {
        id: projectId,
        parentUserId: session.user.email,
      },
      {
        $set: {
          name: projectData.name,
          description: projectData.description,
          files: projectData.files.map((file: FileData) => ({
            ...file,
            path: `/${file.name}`,
            size: file.content?.length || 0,
            lastModified: new Date(),
          })),
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      project: {
        id: updatedProject.id,
        name: updatedProject.name,
        lastSaved: updatedProject.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error saving project:", error);
    return NextResponse.json(
      { error: "Failed to save project" },
      { status: 500 }
    );
  }
}
