/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { IPhotoRepository } from "./IPhotoRepository";
import { Photo } from "../modules/photo/domain/entities/photo.entity";

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
    const record = (await prisma.photo.findUnique({
      where: { id },
    })) as unknown as PrismaPhoto | null;
    return record ? Photo.create({
      id: record.id,
      url: record.url,
      userId: record.userId,
      uploadedAt: record.uploadedAt,
      metadata: record.metadata
    }) : null;
  }

  async findAll(): Promise<Photo[]> {
    const records = (await prisma.photo.findMany()) as unknown as PrismaPhoto[];
    return records.map((r) => Photo.create({
      id: r.id,
      url: r.url,
      userId: r.userId,
      uploadedAt: r.uploadedAt,
      metadata: r.metadata
    }));
  }

  async create(data: Partial<Photo>): Promise<Photo> {
    const photo = Photo.create({
      url: data.url!,
      userId: data.userId!,
      uploadedAt: new Date(),
      metadata: data.metadata || {},
    });
    const created = (await prisma.photo.create({
      data: {
        url: photo.url,
        userId: photo.userId,
        metadata: photo.metadata || {},
      },
    })) as unknown as PrismaPhoto;
    return Photo.create({
      id: created.id,
      url: created.url,
      userId: created.userId,
      uploadedAt: created.uploadedAt,
      metadata: created.metadata
    });
  }

  async update(id: string, data: Partial<Photo>): Promise<Photo> {
    const updated = (await prisma.photo.update({
      where: { id },
      data: {
        url: data.url,
        userId: data.userId,
        metadata: data.metadata,
      },
    })) as unknown as PrismaPhoto;
    return Photo.create({
      id: updated.id,
      url: updated.url,
      userId: updated.userId,
      uploadedAt: updated.uploadedAt,
      metadata: updated.metadata
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.photo.delete({ where: { id } });
  }
}
