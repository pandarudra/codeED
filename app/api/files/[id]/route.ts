// app/api/files/[id]/route.ts
import { NextResponse } from "next/server";
import { GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { connectToDB } from "@/lib/mongodb";
import { File } from "@/models/file.model";
import { s3, BUCKET_NAME } from "@/lib/s3Client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Download file content
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();

    const fileId = params.id;

    // TODO: Add permission check
    const file = await File.findOne({
      _id: fileId,
      isDeleted: false,
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Get file from B2
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: file.b2Key,
    });

    const response = await s3.send(getCommand);
    const fileContent = await response.Body?.transformToString();

    return NextResponse.json({
      content: fileContent,
      metadata: {
        name: file.name,
        extension: file.extension,
        type: file.type,
        size: file.size,
        lastModified: file.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    );
  }
}

// DELETE - Delete file
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }
    await connectToDB();

    const fileId = params.id;

    // TODO: Get userId and verify permissions
    const userId = session.user?.id;

    const file = await File.findOneAndUpdate(
      { _id: fileId },
      { isDeleted: true, lastModifiedBy: userId },
      { new: true }
    );

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Optional: Delete from B2 as well (uncomment for hard delete)

    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: file.b2Key,
      });
      await s3.send(deleteCommand);
    } catch (b2Error) {
      console.error("Error deleting from B2:", b2Error);
    }

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
