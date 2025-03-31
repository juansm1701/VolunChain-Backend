import { BackblazeService } from "../src/modules/photo/infrastructure/services/BackblazeService";
import fs from "fs";
import path from "path";
import "dotenv/config";

describe("BackblazeService", () => {
  const service = new BackblazeService();

  const filePath = path.join(__dirname, "test-image.txt");
  const fileName = `test-${Date.now()}.txt`;

  beforeAll(() => {
    fs.writeFileSync(filePath, "Test file content");
  });

  afterAll(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  it("should upload and delete a file from Backblaze B2", async () => {
    const fileId = await service.uploadFile(filePath, fileName);
    expect(fileId).toBeDefined();

    await service.deleteFile(fileId, fileName);
  });
});
