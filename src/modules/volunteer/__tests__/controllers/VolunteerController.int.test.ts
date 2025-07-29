import request from "supertest";
import express, { Express } from "express";
import VolunteerController from "../../presentation/controllers/VolunteerController";

function setupApp(): Express {
  const app = express();
  app.use(express.json());
  const controller = new VolunteerController();
  app.post("/volunteers", controller.createVolunteer.bind(controller));
  app.get("/volunteers/:id", controller.getVolunteerById.bind(controller));
  app.get(
    "/projects/:projectId/volunteers",
    controller.getVolunteersByProjectId.bind(controller)
  );
  return app;
}

describe("VolunteerController", () => {
  let app: Express;

  beforeEach(() => {
    app = setupApp();
    jest.clearAllMocks();
  });

  describe.skip("POST /volunteers", () => {
    it("should create a volunteer and return 201", async () => {
      // TODO: Update test to use new modular architecture
      const res = await request(app).post("/volunteers").send({ name: "Test" });
      expect(res.status).toBe(201);
    });
  });

  describe.skip("GET /volunteers/:id", () => {
    // TODO: Update tests to use new modular architecture
  });

  describe.skip("GET /projects/:projectId/volunteers", () => {
    // TODO: Update tests to use new modular architecture
  });
});
