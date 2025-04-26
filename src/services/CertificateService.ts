import { generateCertificate } from "../utils/pdfGenerator";
import fs from "fs";
import path from "path";
import { prisma } from "../config/prisma";
import { v4 as uuidv4 } from "uuid";

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
    const pdfBuffer = await generateCertificate({ ...volunteerData, uniqueId });

    const filePath = path.join(
      __dirname,
      `../../assets/certificates/${volunteerId}.pdf`
    );
    fs.writeFileSync(filePath, pdfBuffer);

    await prisma.certificate.create({
      data: {
        volunteerId,
        filePath,
        uniqueId,
        customMessage: volunteerData.customMessage,
      },
    });
  }

  static async getCertificatePath(volunteerId: string) {
    const cert = await prisma.certificate.findUnique({
      where: { volunteerId },
    });
    if (!cert) throw new Error("Certificate not found");
    return cert.filePath;
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
