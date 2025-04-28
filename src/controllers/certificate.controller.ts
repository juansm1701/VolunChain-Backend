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

  // console.log(volunteer);

  if (!volunteer || !volunteer.id) {
    res.status(403).json({ error: "No such volunteer exist" });
    return;
  }

  try {
    const path = await CertificateService.getCertificatePath(volunteerId);
    const cert = await prisma.certificate.findUnique({
      where: { volunteerId },
    });
    await CertificateService.logDownload(cert!.id, userId);
    res.download(path);
  } catch (err) {
    res.status(404).json({ error: "Certificate not available" });
  }
};

export const createCertificate = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const volunteerId = req.params.id;
  // const userId: string = `${req.user?.id}`;

  const volunteer = await prisma.volunteer.findUnique({
    where: { id: volunteerId },
    include: { userVolunteers: true, project: true },
  });

  if (!volunteer || !volunteer.id) {
    res.status(403).json({ error: "No such volunteer exist" });
    return;
  }

  // console.log(volunteer);

  const { eventDate, organizationSignature, customMessage } = req.body;

  if (!eventDate || !organizationSignature || !customMessage) {
    res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await CertificateService.createCertificate(volunteerId, {
      volunteerName: volunteer.name,
      projectName: volunteer.project.name,
      eventDate,
      organizationSignature,
      customMessage,
    });
    res.status(201).json({ message: "Certificate created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create certificate", err });
  }
};
