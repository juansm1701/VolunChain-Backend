import { PrismaClient } from '@prisma/client';
import { IPhotoRepository } from '@/repository/IPhotoRepository';
import { Photo } from '@/entities/Photo';

// Define our own types based on the Prisma schema
interface PrismaPhoto {
  id: string;
  url: string;
  userId: string;
  uploadedAt: Date;
  metadata: any;
}

const prisma = new PrismaClient();

export class PhotoRepository implements IPhotoRepository {
  async findById(id: string): Promise<Photo | null> {
    const record = await prisma.photo.findUnique({ where: { id } }) as unknown as PrismaPhoto | null;
    return record ? new Photo(record) : null;
  }

  async findAll(): Promise<Photo[]> {
    const records = await prisma.photo.findMany() as unknown as PrismaPhoto[];
    return records.map((r) => new Photo(r));
  }

  async create(data: Partial<Photo>): Promise<Photo> {
    const photo = new Photo(data);
    photo.validate();
    const created = await prisma.photo.create({ 
      data: {
        url: data.url!,
        userId: data.userId!,
        uploadedAt: data.uploadedAt || new Date(),
        metadata: data.metadata || {}
      }
    }) as unknown as PrismaPhoto;
    return new Photo(created);
  }

  async update(id: string, data: Partial<Photo>): Promise<Photo> {
    const updated = await prisma.photo.update({
      where: { id },
      data: {
        url: data.url,
        userId: data.userId,
        uploadedAt: data.uploadedAt,
        metadata: data.metadata
      },
    }) as unknown as PrismaPhoto;
    return new Photo(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.photo.delete({ where: { id } });
  }
}
