import {
  S3Client,
  CreateBucketCommand,
  PutBucketCorsCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function setupS3Bucket() {
  const region = process.env.AWS_REGION || "us-east-1";
  const bucketName = process.env.S3_BUCKET_NAME;

  if (!bucketName) {
    console.error("❌ S3_BUCKET_NAME environment variable is not set");
    process.exit(1);
  }

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });

  try {
    console.log(`Creating bucket: ${bucketName}`);

    const bucketParams: any = {
      Bucket: bucketName,
    };

    if (region !== "us-east-1") {
      bucketParams.CreateBucketConfiguration = {
        LocationConstraint: region as any,
      };
    }

    await s3Client.send(new CreateBucketCommand(bucketParams));
    console.log(`✅ Bucket created successfully`);

    // Set up CORS configuration
    console.log("Setting up CORS policy...");
    await s3Client.send(
      new PutBucketCorsCommand({
        Bucket: bucketName,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedHeaders: ["*"],
              AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
              AllowedOrigins: ["*"],
              ExposeHeaders: ["ETag"],
              MaxAgeSeconds: 3000,
            },
          ],
        },
      })
    );
    console.log(`✅ CORS policy configured successfully`);
    console.log(`🎉 S3 bucket "${bucketName}" is ready for use!`);
  } catch (error: any) {
    if (error.name === "BucketAlreadyExists") {
      console.log(`✅ Bucket "${bucketName}" already exists`);
    } else if (error.name === "BucketAlreadyOwnedByYou") {
      console.log(
        `✅ Bucket "${bucketName}" already exists and is owned by you`
      );
    } else {
      console.error("❌ Error setting up S3 bucket:", error);
    }
  }
}

setupS3Bucket();
