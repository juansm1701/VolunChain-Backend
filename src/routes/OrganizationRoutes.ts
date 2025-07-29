import { Router } from "express";
import OrganizationController from "../modules/organization/presentation/controllers/OrganizationController.stub";
import auth from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/", OrganizationController.createOrganization);
router.get("/", OrganizationController.getAllOrganizations);
router.get("/:id", OrganizationController.getOrganizationById);
router.get("/email/:email", OrganizationController.getOrganizationByEmail);

// Protected routes
router.put(
  "/:id",
  auth.authMiddleware,
  OrganizationController.updateOrganization
);
router.delete(
  "/:id",
  auth.authMiddleware,
  OrganizationController.deleteOrganization
);

export default router;
