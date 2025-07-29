import { Router } from "express";
import ProjectController from "../modules/project/presentation/controllers/Project.controller.stub";

const router = Router();
const projectController = new ProjectController();

router.post("/", async (req, res) => projectController.createProject(req, res));
router.get("/:id", async (req, res) =>
  projectController.getProjectById(req, res)
);
router.get("/organizations/:organizationId", async (req, res) =>
  projectController.getProjectsByOrganizationId(req, res)
);

export default router;
