import { S3Client } from "@aws-sdk/client-s3";

const accessKeyId = process.env.B2_KEY_ID;
const secretAccessKey = process.env.B2_APP_KEY;

if (!accessKeyId || !secretAccessKey) {
  throw new Error("Missing B2_KEY_ID or B2_APP_KEY environment variables");
}

export const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
});
