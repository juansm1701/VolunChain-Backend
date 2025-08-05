export interface CertificateMetadata {
  volunteerName: string;
  projectName: string;
  eventDate: string;
  organizationSignature: string;
  customMessage: string;
}

export interface ICertificateService {
  createCertificate(
    volunteerId: string,
    volunteerData: CertificateMetadata
  ): Promise<string>;

  getCertificateUrl(volunteerId: string, expiresIn?: number): Promise<string>;

  getCertificateBuffer(volunteerId: string): Promise<Buffer>;

  logDownload(certificateId: string, userId: string): Promise<void>;
}
