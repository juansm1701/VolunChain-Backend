import B2 from "backblaze-b2";
import fs from "fs";

export class BackblazeService {
  private b2: B2;

  constructor() {
    this.b2 = new B2({
      applicationKeyId: process.env.BACKBLAZE_APPLICATION_KEY_ID!,
      applicationKey: process.env.BACKBLAZE_APPLICATION_KEY!,
    });
  }

  async authorize() {
    await this.b2.authorize();
  }

  async uploadFile(filePath: string, fileName: string): Promise<string> {
    await this.authorize();

    const { data } = await this.b2.getUploadUrl({
      bucketId: process.env.BACKBLAZE_BUCKET_ID!,
    });

    const buffer = fs.readFileSync(filePath);

    const upload = await this.b2.uploadFile({
      uploadUrl: data.uploadUrl,
      uploadAuthToken: data.authorizationToken,
      fileName,
      data: buffer,
    });

    return upload.data.fileId;
  }

  async deleteFile(fileId: string, fileName: string): Promise<void> {
    await this.authorize();

    await this.b2.deleteFileVersion({
      fileId,
      fileName,
    });
  }
}
