import { s3 } from "@/lib/s3Client";
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { Buckets } = await s3.send(new ListBucketsCommand({}));
    const names = Buckets?.map((b) => b.Name) ?? [];
    return NextResponse.json({ buckets: names }, { status: 200 });
  } catch (err: unknown) {
    console.error("Error connecting to B2:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
