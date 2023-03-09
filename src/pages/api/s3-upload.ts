import { S3Client } from "@aws-sdk/client-s3";
import { APIRoute } from "next-s3-upload";

export default APIRoute.configure({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  bucket: process.env.S3_BUCKET_NAME,
  region: process.env.S3_REGION,
  forcePathStyle: true,
});

export const client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
});
