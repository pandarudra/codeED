import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { connectToDB } from "@/lib/mongodb";
import { Workspace } from "@/models/workspace.model";
import { v4 as uuidv4 } from "uuid";
import { s3, BUCKET_NAME } from "@/lib/s3Client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Fetch all workspaces for a user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    await connectToDB();

    // TODO: Get userId from authentication/session
    const userId = session.user.id; // Replace with actual user ID from auth

    const workspaces = await Workspace.find({
      parentUserId: userId,
      isDeleted: false,
    }).sort({ updatedAt: -1 });

    return NextResponse.json(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
      { status: 500 }
    );
  }
}

// POST - Create new workspace
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    await connectToDB();

    const { name, description = "", isPublic = false } = await req.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Workspace name is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Generate workspace ID
    const workspaceId = uuidv4();

    // Create B2 bucket path for workspace
    const b2BucketPath = `workspaces/${workspaceId}/`;

    // Create initial .workspace file in B2 to establish the folder structure
    const initFileKey = `${b2BucketPath}.workspace`;
    const initFileContent = JSON.stringify({
      workspaceId,
      name,
      createdAt: new Date().toISOString(),
      type: "workspace_init",
    });

    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: initFileKey,
      Body: initFileContent,
      ContentType: "application/json",
    });

    await s3.send(putCommand);

    // Create workspace in MongoDB
    const workspace = new Workspace({
      name: name.trim(),
      description: description.trim(),
      parentUserId: userId,
      b2BucketPath,
      isPublic,
      lastModifiedBy: userId,
      collaborators: [userId], // Creator is first collaborator
      settings: {
        defaultLanguage: "javascript",
        theme: "dark",
      },
    });

    const savedWorkspace = await workspace.save();

    return NextResponse.json(savedWorkspace, { status: 201 });
  } catch (error) {
    console.error("Error creating workspace:", error);
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 }
    );
  }
}
