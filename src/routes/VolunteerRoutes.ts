import { Router } from "express";
import VolunteerController from "../controllers/VolunteerController";

const router = Router();
const volunteerController = new VolunteerController();

router.post("/", async (req, res) =>
  volunteerController.createVolunteer(req, res)
);
router.get("/:id", async (req, res) =>
  volunteerController.getVolunteerById(req, res)
);
router.get("/projects/:projectId", async (req, res) =>
  volunteerController.getVolunteersByProjectId(req, res)
);

export default router;
