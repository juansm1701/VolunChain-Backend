import { Router } from "express";
import {
  downloadCertificate,
  createCertificate,
} from "../controllers/certificate.controller";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/volunteers/:id", authMiddleware, downloadCertificate);
router.post("/volunteers/:id", authMiddleware, createCertificate);

export default router;
