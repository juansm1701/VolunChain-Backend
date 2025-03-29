import { PrismaClient } from '@prisma/client';
import { PhotoRepository } from '../../src/repository/PhotoRepository';

const prisma = new PrismaClient();
const repository = new PhotoRepository();

beforeEach(async () => {
  await prisma.photo.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('PhotoRepository (Prisma)', () => {
  it('should create a photo', async () => {
    const photo = await repository.create({
      url: 'https://example.com/photo.jpg',
      userId: 'user-1',
    });
    expect(photo.id).toBeDefined();
    expect(photo.url).toBe('https://example.com/photo.jpg');
  });

  it('should find a photo by id', async () => {
    const created = await repository.create({
      url: 'https://example.com/photo.jpg',
      userId: 'user-1',
    });

    const found = await repository.findById(created.id!);
    expect(found?.id).toBe(created.id);
  });

  it('should update a photo', async () => {
    const created = await repository.create({
      url: 'https://example.com/photo.jpg',
      userId: 'user-1',
    });

    const updated = await repository.update(created.id!, {
      url: 'https://new-url.com/photo.jpg',
    });

    expect(updated.url).toBe('https://new-url.com/photo.jpg');
  });

  it('should delete a photo', async () => {
    const created = await repository.create({
      url: 'https://example.com/photo.jpg',
      userId: 'user-1',
    });

    await repository.delete(created.id!);
    const result = await repository.findById(created.id!);

    expect(result).toBeNull();
  });
});
