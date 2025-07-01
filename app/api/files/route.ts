// app/api/files/route.ts
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { connectToDB } from "@/lib/mongodb";
import { File } from "@/models/file.model";
import { Folder } from "@/models/folder.model";
import { Workspace } from "@/models/workspace.model";
import { s3, BUCKET_NAME } from "@/lib/s3Client";
import {
  generateB2Key,
  calculateChecksum,
  getFileType,
  getMimeType,
} from "@/lib/file-utils";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST - Upload/Create new file
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

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const parentFolderId = formData.get("parentFolderId") as string;

    if (!file || !parentFolderId) {
      return NextResponse.json(
        { error: "File and parent folder ID are required" },
        { status: 400 }
      );
    }

    // TODO: Get userId from authentication/session
    const userId = session.user.id;

    // Get folder and workspace info
    const folder = await Folder.findOne({
      _id: parentFolderId,
      isDeleted: false,
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const workspace = await Workspace.findOne({
      _id: folder.parentWorkspaceId,
      isDeleted: false,
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // File validation
    const fileName = file.name;
    const fileExtension = path.extname(fileName).slice(1).toLowerCase();
    const fileNameWithoutExt = path.basename(fileName, path.extname(fileName));

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileSize = fileBuffer.length;
    const checksum = calculateChecksum(fileBuffer);

    // Generate B2 key
    const folderPath = folder.path.substring(1); // Remove leading slash
    const b2Key = generateB2Key(workspace._id.toString(), folderPath, fileName);

    // Upload to B2
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: b2Key,
      Body: fileBuffer,
      ContentType: getMimeType(fileExtension),
      Metadata: {
        "original-name": fileName,
        "workspace-id": workspace._id.toString(),
        "folder-id": folder._id.toString(),
        "uploaded-by": userId,
        checksum: checksum,
      },
    });

    await s3.send(putCommand);

    // Count lines for text files
    let lineCount = 0;
    if (
      getMimeType(fileExtension).startsWith("text/") ||
      ["javascript", "typescript", "python", "html", "css"].includes(
        getFileType(fileExtension)
      )
    ) {
      lineCount = fileBuffer.toString("utf-8").split("\n").length;
    }

    // Create file record in MongoDB
    const newFile = new File({
      name: fileNameWithoutExt,
      extension: fileExtension,
      type: getFileType(fileExtension),
      mimeType: getMimeType(fileExtension),
      parentWorkspaceId: folder.parentWorkspaceId,
      parentFolderId: folder._id,
      path: `${folder.path}/${fileName}`,
      b2Key,
      size: fileSize,
      checksum,
      lastModifiedBy: userId,
      permissions: {
        read: [userId],
        write: [userId],
      },
      metadata: {
        language: getFileType(fileExtension),
        encoding: "utf-8",
        lineCount,
      },
    });

    const savedFile = await newFile.save();

    return NextResponse.json(savedFile, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
