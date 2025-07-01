// app/api/folders/[id]/files/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { File } from "@/models/file.model";

// GET - Fetch files in folder
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();

    const folderId = params.id;

    const files = await File.find({
      parentFolderId: folderId,
      isDeleted: false,
    }).sort({ name: 1 });

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
