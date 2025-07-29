import { CertificateService } from "../../modules/certificate/application/services/CertificateService";
import { ICertificateService } from "../../modules/certificate/domain/interfaces/ICertificateService";

export const container = {
  certificateService: new CertificateService() as ICertificateService,
};
