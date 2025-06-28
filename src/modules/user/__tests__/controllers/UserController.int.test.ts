// Integration test for UserController
import request from "supertest";
import express, { Express } from "express";
import UserController from "../../presentation/controllers/UserController";

// Mock the UserService
jest.mock("../../../../services/UserService");
import { UserService } from "../../../../services/UserService";

// Mock DTOs
jest.mock("../../../../modules/user/dto/CreateUserDto", () => {
  return {
    CreateUserDto: function () {
      return {};
    },
  };
});
jest.mock("../../../../modules/user/dto/UpdateUserDto", () => {
  return {
    UpdateUserDto: function () {
      return {};
    },
  };
});

function setupApp(): Express {
  const app = express();
  app.use(express.json());
  const controller = new UserController();
  app.post("/users", controller.createUser.bind(controller));
  app.get("/users/:id", controller.getUserById.bind(controller));
  app.get("/users", controller.getUserByEmail.bind(controller));
  app.put("/users/:id", controller.updateUser.bind(controller));
  return app;
}

describe("UserController", () => {
  let app: Express;

  beforeEach(() => {
    app = setupApp();
    jest.clearAllMocks();
  });

  describe("POST /users", () => {
    it("should create a user and return 201", async () => {
      const mockUser = { id: "1", email: "test@example.com" };
      (UserService as jest.Mock).mockImplementation(() => ({
        createUser: jest.fn().mockResolvedValue(mockUser),
      }));
      const res = await request(app)
        .post("/users")
        .send({ email: "test@example.com" });
      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockUser);
    });

    it("should handle errors and return 400", async () => {
      (UserService as jest.Mock).mockImplementation(() => ({
        createUser: jest.fn().mockRejectedValue(new Error("fail")),
      }));
      const res = await request(app)
        .post("/users")
        .send({ email: "test@example.com" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("fail");
    });
  });

  describe("GET /users/:id", () => {
    it("should return a user by id", async () => {
      const mockUser = { id: "1", email: "test@example.com" };
      (UserService as jest.Mock).mockImplementation(() => ({
        getUserById: jest.fn().mockResolvedValue(mockUser),
      }));
      const res = await request(app).get("/users/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
    });

    it("should return 404 if user not found", async () => {
      (UserService as jest.Mock).mockImplementation(() => ({
        getUserById: jest.fn().mockResolvedValue(null),
      }));
      const res = await request(app).get("/users/1");
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("User not found");
    });

    it("should handle errors and return 400", async () => {
      (UserService as jest.Mock).mockImplementation(() => ({
        getUserById: jest.fn().mockRejectedValue(new Error("fail")),
      }));
      const res = await request(app).get("/users/1");
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("fail");
    });
  });

  describe("GET /users?email=", () => {
    it("should return a user by email", async () => {
      const mockUser = { id: "1", email: "test@example.com" };
      (UserService as jest.Mock).mockImplementation(() => ({
        getUserByEmail: jest.fn().mockResolvedValue(mockUser),
      }));
      const res = await request(app).get("/users?email=test@example.com");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
    });

    it("should return 400 if email is missing", async () => {
      const res = await request(app).get("/users");
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Email is required");
    });

    it("should return 404 if user not found", async () => {
      (UserService as jest.Mock).mockImplementation(() => ({
        getUserByEmail: jest.fn().mockResolvedValue(null),
      }));
      const res = await request(app).get("/users?email=test@example.com");
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("User not found");
    });

    it("should handle errors and return 400", async () => {
      (UserService as jest.Mock).mockImplementation(() => ({
        getUserByEmail: jest.fn().mockRejectedValue(new Error("fail")),
      }));
      const res = await request(app).get("/users?email=test@example.com");
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("fail");
    });
  });

  describe("PUT /users/:id", () => {
    it("should update a user and return 200", async () => {
      (UserService as jest.Mock).mockImplementation(() => ({
        updateUser: jest.fn().mockResolvedValue(undefined),
      }));
      const res = await request(app).put("/users/1").send({ name: "Updated" });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User updated successfully");
    });

    it("should handle errors and return 400", async () => {
      (UserService as jest.Mock).mockImplementation(() => ({
        updateUser: jest.fn().mockRejectedValue(new Error("fail")),
      }));
      const res = await request(app).put("/users/1").send({ name: "Updated" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("fail");
    });
  });
});
