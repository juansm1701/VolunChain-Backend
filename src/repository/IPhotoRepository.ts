import { Photo } from '@/entities/Photo';

export interface IPhotoRepository {
  findById(id: string): Promise<Photo | null>;
  findAll(): Promise<Photo[]>;
  create(data: Partial<Photo>): Promise<Photo>;
  update(id: string, data: Partial<Photo>): Promise<Photo>;
  delete(id: string): Promise<void>;
}
