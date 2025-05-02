import { CertificateService } from "./certificates/CertificateService";
import { ICertificateService } from "../../shared/domain/interfaces/ICertificateService";

export const container = {
  certificateService: new CertificateService() as ICertificateService,
};
