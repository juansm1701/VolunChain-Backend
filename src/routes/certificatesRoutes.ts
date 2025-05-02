import { Router } from "express";
import {
  downloadCertificate,
  createCertificate,
} from "../controllers/certificate.controller";
import auth from "../middleware/authMiddleware";

const router = Router();

router.get("/volunteers/:id", auth.authMiddleware, downloadCertificate);
router.post("/volunteers/:id", auth.authMiddleware, createCertificate);

export default router;
