import { Request, Response } from "express";
import { CertificateService } from "../services/CertificateService";
import { prisma } from "../config/prisma";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    isVerified: boolean;
  };
}

export const downloadCertificate = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const volunteerId = req.params.id;
  const userId: string = `${req.user?.id}`;

  const volunteer = await prisma.volunteer.findUnique({
    where: { id: volunteerId },
    include: { project: true },
  });

  if (!volunteer || !volunteer.id) {
    res.status(403).json({ error: "No such volunteer exists" });
    return;
  }

  try {
    if (req.query.direct === "true") {
      const pdfBuffer =
        await CertificateService.getCertificateBuffer(volunteerId);
      const cert = await prisma.certificate.findUnique({
        where: { volunteerId },
      });

      await CertificateService.logDownload(cert!.id, userId);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="certificate-${volunteer.name}.pdf"`
      );

      res.send(pdfBuffer);
      return;
    }

    // Redirect approach with pre-signed URL
    else {
      const cert = await prisma.certificate.findUnique({
        where: { volunteerId },
      });

      if (!cert) {
        res.status(404).json({ error: "Certificate not found" });
        return;
      }

      await CertificateService.logDownload(cert.id, userId);

      // Get a pre-signed URL and redirect the user to it
      const presignedUrl =
        await CertificateService.getCertificateUrl(volunteerId);
      return res.redirect(presignedUrl);
    }
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Certificate not available" });
  }
};

export const createCertificate = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const volunteerId = req.params.id;

  const volunteer = await prisma.volunteer.findUnique({
    where: { id: volunteerId },
    include: { userVolunteers: true, project: true },
  });

  if (!volunteer || !volunteer.id) {
    res.status(403).json({ error: "No such volunteer exists" });
    return;
  }

  const { eventDate, organizationSignature, customMessage } = req.body;

  if (!eventDate || !organizationSignature || !customMessage) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const uniqueId = await CertificateService.createCertificate(volunteerId, {
      volunteerName: volunteer.name,
      projectName: volunteer.project.name,
      eventDate,
      organizationSignature,
      customMessage,
    });

    res.status(201).json({
      message: "Certificate created successfully",
      certificateId: uniqueId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create certificate", err });
  }
};
