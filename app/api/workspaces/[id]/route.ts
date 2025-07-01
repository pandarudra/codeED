// app/api/workspaces/[id]/route.ts
import { NextResponse } from "next/server";
import { DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { connectToDB } from "@/lib/mongodb";
import { Workspace } from "@/models/workspace.model";
import { Folder } from "@/models/folder.model";
import { File } from "@/models/file.model";
import { s3, BUCKET_NAME } from "@/lib/s3Client";

// DELETE - Soft delete workspace
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();

    const workspaceId = params.id;

    // TODO: Get userId from authentication/session and verify ownership
    const userId = "user123";

    // Soft delete workspace in MongoDB
    const workspace = await Workspace.findOneAndUpdate(
      { _id: workspaceId, parentUserId: userId },
      { isDeleted: true, lastModifiedBy: userId },
      { new: true }
    );

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found or unauthorized" },
        { status: 404 }
      );
    }

    // Soft delete all folders and files in workspace
    await Folder.updateMany(
      { parentWorkspaceId: workspaceId },
      { isDeleted: true, lastModifiedBy: userId }
    );

    await File.updateMany(
      { parentWorkspaceId: workspaceId },
      { isDeleted: true, lastModifiedBy: userId }
    );

    // Optional: Also delete from B2 (uncomment if you want hard delete from B2)

    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: workspace.b2BucketPath,
      });

      const listResponse = await s3.send(listCommand);

      if (listResponse.Contents) {
        for (const object of listResponse.Contents) {
          if (object.Key) {
            await s3.send(
              new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: object.Key,
              })
            );
          }
        }
      }
    } catch (b2Error) {
      console.error("Error deleting from B2:", b2Error);
      // Continue even if B2 deletion fails
    }

    return NextResponse.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return NextResponse.json(
      { error: "Failed to delete workspace" },
      { status: 500 }
    );
  }
}
