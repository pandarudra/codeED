// /app/api/upload/route.ts
import { NextResponse } from "next/server";
import { s3 } from "@/lib/s3Client";
import {
  PutObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = formData.get("folder") as string | null;

  if (!file || !folder) {
    return NextResponse.json({ error: "Missing file or folder" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `${folder}/${file.name}`;

  try {
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    });

    await s3.send(uploadCommand);

    return NextResponse.json({ success: true, key });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to upload to B2" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { folder } = await req.json();
    if (!folder) {
      return NextResponse.json({ error: "Missing folder" }, { status: 400 });
    }

    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.B2_BUCKET_NAME!,
      Prefix: `${folder}/`,
    });
    const listResult = await s3.send(listCommand);

    const objects = listResult.Contents?.map((obj) => ({ Key: obj.Key! })) || [];

    if (objects.length > 0) {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: process.env.B2_BUCKET_NAME!,
        Delete: {
          Objects: objects,
        },
      });

      await s3.send(deleteCommand);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Failed to delete from B2" }, { status: 500 });
  }
}
