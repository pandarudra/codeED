// app/api/workspaces/[id]/folders/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Folder } from "@/models/folder.model";

// GET - Fetch folders in workspace
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();

    const workspaceId = params.id;
    const { searchParams } = new URL(req.url);
    const parentFolderId = searchParams.get("parentFolderId");

    const query: any = {
      parentWorkspaceId: workspaceId,
      isDeleted: false,
    };

    // If parentFolderId is provided, get subfolders; otherwise get root folders
    if (parentFolderId && parentFolderId !== "null") {
      query.parentFolderId = parentFolderId;
    } else {
      query.parentFolderId = null;
    }

    const folders = await Folder.find(query).sort({ name: 1 });

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}
