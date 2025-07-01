// app/api/folders/route.ts
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { connectToDB } from "@/lib/mongodb";
import { Folder } from "@/models/folder.model";
import { Workspace } from "@/models/workspace.model";
import { s3, BUCKET_NAME } from "@/lib/s3Client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST - Create new folder
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    await connectToDB();

    const { name, parentWorkspaceId, parentFolderId = null } = await req.json();

    if (!name || !parentWorkspaceId) {
      return NextResponse.json(
        { error: "Folder name and workspace ID are required" },
        { status: 400 }
      );
    }

    // TODO: Get userId from authentication/session
    const userId = session.user?.id;

    // Verify workspace exists and user has access
    const workspace = await Workspace.findOne({
      _id: parentWorkspaceId,
      isDeleted: false,
      $or: [{ parentUserId: userId }, { collaborators: userId }],
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found or unauthorized" },
        { status: 404 }
      );
    }

    // Build folder path
    let folderPath = name.trim();
    if (parentFolderId) {
      const parentFolder = await Folder.findOne({
        _id: parentFolderId,
        parentWorkspaceId,
        isDeleted: false,
      });

      if (!parentFolder) {
        return NextResponse.json(
          { error: "Parent folder not found" },
          { status: 404 }
        );
      }

      folderPath = `${parentFolder.path}/${name.trim()}`;
    } else {
      folderPath = `/${name.trim()}`;
    }

    // Create folder marker in B2
    const b2FolderKey = `${workspace.b2BucketPath}${folderPath.substring(
      1
    )}/.folder`;
    const folderMetadata = JSON.stringify({
      name: name.trim(),
      parentWorkspaceId,
      parentFolderId,
      createdAt: new Date().toISOString(),
      type: "folder_marker",
    });

    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: b2FolderKey,
      Body: folderMetadata,
      ContentType: "application/json",
    });

    await s3.send(putCommand);

    // Create folder in MongoDB
    const folder = new Folder({
      name: name.trim(),
      parentWorkspaceId,
      parentFolderId,
      path: folderPath,
      lastModifiedBy: userId,
      permissions: {
        read: [userId],
        write: [userId],
      },
    });

    const savedFolder = await folder.save();

    return NextResponse.json(savedFolder, { status: 201 });
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}
