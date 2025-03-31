export class Photo {
  id?: string;
  url: string;
  userId: string;
  uploadedAt?: Date;
  metadata?: Record<string, any>;

  constructor(props: any) {
    this.id = props.id;
    this.url = props.url;
    this.userId = props.userId;
    this.uploadedAt = props.uploadedAt;
    this.metadata = props.metadata ?? {};
  }

  validate(): boolean {
    if (!this.url) throw new Error('Photo URL is required');
    if (!/^https?:\/\/.+$/.test(this.url)) throw new Error('Photo URL is invalid');
    if (!this.userId) throw new Error('User ID is required');
    return true;
  }

  updateMetadata(newMetadata: Record<string, any>): void {
    this.metadata = { ...this.metadata, ...newMetadata };
  }
}
