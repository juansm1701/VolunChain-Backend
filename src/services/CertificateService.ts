import { generateCertificate } from "../utils/pdfGenerator";
import { prisma } from "../config/prisma";
import { v4 as uuidv4 } from "uuid";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "";

export class CertificateService {
  static async createCertificate(
    volunteerId: string,
    volunteerData: {
      volunteerName: string;
      projectName: string;
      eventDate: string;
      organizationSignature: string;
      customMessage: string;
    }
  ) {

    const uniqueId = uuidv4();

    // Generate the PDF buffer
    const pdfBuffer = await generateCertificate({ ...volunteerData, uniqueId });

    
    const s3Key = `certificates/${volunteerId}/${uniqueId}.pdf`;
    console.log(BUCKET_NAME, s3Key, 95);

    
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: pdfBuffer,
        ContentType: "application/pdf",
      })
    );

    // Storing certificate metadata in the database
    await prisma.certificate.create({
      data: {
        volunteerId,
        s3Key, 
        uniqueId,
        customMessage: volunteerData.customMessage,
      },
    });

    return uniqueId;
  }

  static async getCertificateUrl(volunteerId: string, expiresIn = 3600) {
    // Find the certificate record in the database
    const cert = await prisma.certificate.findUnique({
      where: { volunteerId },
    });

    if (!cert) throw new Error("Certificate not found");

    // Generate a pre-signed URL for the S3 object
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: cert.s3Key,
    });

    // URL expires in 1 hour (3600 seconds) by default
    const url = await getSignedUrl(s3Client, command, { expiresIn });

    return url;
  }

  static async getCertificateBuffer(volunteerId: string) {
    // Find the certificate record in the database
    const cert = await prisma.certificate.findUnique({
      where: { volunteerId },
    });

    if (!cert) throw new Error("Certificate not found");


    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: cert.s3Key,
    });

    const response = await s3Client.send(command);


    return await streamToBuffer(response.Body);
  }

  static async logDownload(certificateId: string, userId: string) {
    await prisma.certificateDownloadLog.create({
      data: {
        certificateId,
        userId,
      },
    });
  }
}

// Helper function to convert a stream to a buffer
async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}
