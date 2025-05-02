import { v4 as uuidv4 } from "uuid";
import { generateCertificate } from "../utils/pdfGenerator";
import { prisma } from "../../../config/prisma";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  CertificateMetadata,
  ICertificateService,
} from "../../domain/interfaces/ICertificateService";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "";

export class CertificateService implements ICertificateService {
  async createCertificate(
    volunteerId: string,
    volunteerData: CertificateMetadata
  ): Promise<string> {
    const uniqueId = uuidv4();

    const pdfBuffer = await generateCertificate({ ...volunteerData, uniqueId });

    const s3Key = `certificates/${volunteerId}/${uniqueId}.pdf`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: pdfBuffer,
        ContentType: "application/pdf",
      })
    );

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

  async getCertificateUrl(
    volunteerId: string,
    expiresIn = 3600
  ): Promise<string> {
    const cert = await prisma.certificate.findUnique({
      where: { volunteerId },
    });

    if (!cert) throw new Error("Certificate not found");

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: cert.s3Key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    return url;
  }

  async getCertificateBuffer(volunteerId: string): Promise<Buffer> {
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

  async logDownload(certificateId: string, userId: string): Promise<void> {
    await prisma.certificateDownloadLog.create({
      data: {
        certificateId,
        userId,
      },
    });
  }
}

// Helper function
async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}
