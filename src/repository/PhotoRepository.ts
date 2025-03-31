import { PrismaClient } from '@prisma/client';
import { IPhotoRepository } from '@/repository/IPhotoRepository';
import { Photo } from '@/entities/Photo';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class PhotoRepository implements IPhotoRepository {
  async findById(id: string): Promise<Photo | null> {
    const record = await prisma.photo.findUnique({ where: { id } });
    return record ? new Photo(record) : null;
  }

  async findAll(): Promise<Photo[]> {
    const records = await prisma.photo.findMany();
    return records.map((r) => new Photo(r));
  }

  async create(data: Partial<Photo>): Promise<Photo> {
    const photo = new Photo(data);
    photo.validate();
    const created = await prisma.photo.create({ data: data as Prisma.PhotoCreateInput });
    ;
    return new Photo(created);
  }

  async update(id: string, data: Partial<Photo>): Promise<Photo> {
    const updated = await prisma.photo.update({
      where: { id },
      data,
    });
    return new Photo(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.photo.delete({ where: { id } });
  }
}
