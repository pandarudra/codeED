import { s3 } from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req: NextRequest) {
  const { fileKey, contentType } = await req.json();
  if (!fileKey || !contentType) {
    return NextResponse.json(
      { error: "Missing fileKey or contentType" },
      { status: 400 }
    );
  }

  try {
    const cmd = new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
    });
    const presignedUrl = await getSignedUrl(s3, cmd, { expiresIn: 3600 });
    return NextResponse.json({ presignedUrl, fileKey });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Presign upload error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
