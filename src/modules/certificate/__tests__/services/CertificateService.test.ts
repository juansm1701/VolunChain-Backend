import { CertificateService } from "../../application/services/CertificateService";
import { generateCertificate } from "../../infrastructure/utils/pdfGenerator";
import { prisma } from "../../../../config/prisma";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CertificateMetadata } from "../../domain/interfaces/ICertificateService";

jest.mock("../../infrastructure/utils/pdfGenerator");
jest.mock("../../../../config/prisma", () => ({
  prisma: {
    certificate: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    certificateDownloadLog: {
      create: jest.fn(),
    },
  },
}));
jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/s3-request-presigner");
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid-123"),
}));

describe("CertificateService", () => {
  let certificateService: CertificateService;
  let mockS3Client: jest.Mocked<S3Client>;
  let mockGenerateCertificate: jest.MockedFunction<typeof generateCertificate>;
  let mockGetSignedUrl: jest.MockedFunction<typeof getSignedUrl>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockS3Client = new S3Client({}) as jest.Mocked<S3Client>;
    mockGenerateCertificate = generateCertificate as jest.MockedFunction<typeof generateCertificate>;
    mockGetSignedUrl = getSignedUrl as jest.MockedFunction<typeof getSignedUrl>;

    (S3Client as jest.Mock).mockImplementation(() => mockS3Client);

    certificateService = new CertificateService();
  });

  describe("createCertificate", () => {
    it("should create certificate successfully", async () => {
      const volunteerId = "volunteer-123";
      const volunteerData: CertificateMetadata = {
        volunteerName: "John Doe",
        projectName: "Clean Water Project",
        eventDate: "2024-01-15",
        organizationSignature: "Org Signature",
        customMessage: "Thank you for your service",
      };

      const mockPdfBuffer = Buffer.from("mock-pdf-data");
      const mockCertificate = {
        id: "cert-123",
        volunteerId,
        s3Key: `certificates/${volunteerId}/mock-uuid-123.pdf`,
        uniqueId: "mock-uuid-123",
        customMessage: volunteerData.customMessage,
      };

      mockGenerateCertificate.mockResolvedValue(mockPdfBuffer);
      mockS3Client.send = jest.fn().mockResolvedValue({});
      (prisma.certificate.create as jest.Mock).mockResolvedValue(mockCertificate);

      const result = await certificateService.createCertificate(volunteerId, volunteerData);

      expect(result).toBe("mock-uuid-123");
      expect(mockGenerateCertificate).toHaveBeenCalledWith({
        ...volunteerData,
        uniqueId: "mock-uuid-123",
      });
      expect(mockS3Client.send).toHaveBeenCalledWith(
        expect.any(PutObjectCommand)
      );
      expect(prisma.certificate.create).toHaveBeenCalledWith({
        data: {
          volunteerId,
          s3Key: `certificates/${volunteerId}/mock-uuid-123.pdf`,
          uniqueId: "mock-uuid-123",
          customMessage: volunteerData.customMessage,
        },
      });
    });

    it("should throw error when PDF generation fails", async () => {
      const volunteerId = "volunteer-123";
      const volunteerData: CertificateMetadata = {
        volunteerName: "John Doe",
        projectName: "Clean Water Project",
        eventDate: "2024-01-15",
        organizationSignature: "Org Signature",
        customMessage: "Thank you for your service",
      };

      mockGenerateCertificate.mockRejectedValue(new Error("PDF generation failed"));

      await expect(
        certificateService.createCertificate(volunteerId, volunteerData)
      ).rejects.toThrow("PDF generation failed");
    });

    it("should throw error when S3 upload fails", async () => {
      const volunteerId = "volunteer-123";
      const volunteerData: CertificateMetadata = {
        volunteerName: "John Doe",
        projectName: "Clean Water Project",
        eventDate: "2024-01-15",
        organizationSignature: "Org Signature",
        customMessage: "Thank you for your service",
      };

      const mockPdfBuffer = Buffer.from("mock-pdf-data");

      mockGenerateCertificate.mockResolvedValue(mockPdfBuffer);
      mockS3Client.send = jest.fn().mockRejectedValue(new Error("S3 upload failed"));

      await expect(
        certificateService.createCertificate(volunteerId, volunteerData)
      ).rejects.toThrow("S3 upload failed");
    });
  });

  describe("getCertificateUrl", () => {
    it("should get certificate URL successfully", async () => {
      const volunteerId = "volunteer-123";
      const mockCertificate = {
        id: "cert-123",
        volunteerId,
        s3Key: `certificates/${volunteerId}/mock-uuid-123.pdf`,
        uniqueId: "mock-uuid-123",
      };
      const mockSignedUrl = "https://s3.amazonaws.com/signed-url";

      (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(mockCertificate);
      mockGetSignedUrl.mockResolvedValue(mockSignedUrl);

      const result = await certificateService.getCertificateUrl(volunteerId);

      expect(result).toBe(mockSignedUrl);
      expect(prisma.certificate.findUnique).toHaveBeenCalledWith({
        where: { volunteerId },
      });
      expect(mockGetSignedUrl).toHaveBeenCalledWith(
        mockS3Client,
        expect.any(GetObjectCommand),
        { expiresIn: 3600 }
      );
    });

    it("should throw error when certificate not found", async () => {
      const volunteerId = "volunteer-123";

      (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        certificateService.getCertificateUrl(volunteerId)
      ).rejects.toThrow("Certificate not found");
    });

    it("should use custom expiration time", async () => {
      const volunteerId = "volunteer-123";
      const customExpiresIn = 7200;
      const mockCertificate = {
        id: "cert-123",
        volunteerId,
        s3Key: `certificates/${volunteerId}/mock-uuid-123.pdf`,
        uniqueId: "mock-uuid-123",
      };
      const mockSignedUrl = "https://s3.amazonaws.com/signed-url";

      (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(mockCertificate);
      mockGetSignedUrl.mockResolvedValue(mockSignedUrl);

      await certificateService.getCertificateUrl(volunteerId, customExpiresIn);

      expect(mockGetSignedUrl).toHaveBeenCalledWith(
        mockS3Client,
        expect.any(GetObjectCommand),
        { expiresIn: customExpiresIn }
      );
    });
  });

  describe("getCertificateBuffer", () => {
    it("should get certificate buffer successfully", async () => {
      const volunteerId = "volunteer-123";
      const mockCertificate = {
        id: "cert-123",
        volunteerId,
        s3Key: `certificates/${volunteerId}/mock-uuid-123.pdf`,
        uniqueId: "mock-uuid-123",
      };
      const mockBuffer = Buffer.from("mock-pdf-data");
      const mockStreamToArray = [mockBuffer];

      (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(mockCertificate);
      mockS3Client.send = jest.fn().mockResolvedValue({
        Body: mockStreamToArray,
      });

      const result = await certificateService.getCertificateBuffer(volunteerId);

      expect(result).toEqual(mockBuffer);
      expect(prisma.certificate.findUnique).toHaveBeenCalledWith({
        where: { volunteerId },
      });
      expect(mockS3Client.send).toHaveBeenCalledWith(
        expect.any(GetObjectCommand)
      );
    });

    it("should throw error when certificate not found", async () => {
      const volunteerId = "volunteer-123";

      (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        certificateService.getCertificateBuffer(volunteerId)
      ).rejects.toThrow("Certificate not found");
    });
  });

  describe("logDownload", () => {
    it("should log download successfully", async () => {
      const certificateId = "cert-123";
      const userId = "user-123";

      (prisma.certificateDownloadLog.create as jest.Mock).mockResolvedValue({
        id: "log-123",
        certificateId,
        userId,
        downloadedAt: new Date(),
      });

      await certificateService.logDownload(certificateId, userId);

      expect(prisma.certificateDownloadLog.create).toHaveBeenCalledWith({
        data: {
          certificateId,
          userId,
        },
      });
    });

    it("should throw error when logging fails", async () => {
      const certificateId = "cert-123";
      const userId = "user-123";

      (prisma.certificateDownloadLog.create as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        certificateService.logDownload(certificateId, userId)
      ).rejects.toThrow("Database error");
    });
  });
});