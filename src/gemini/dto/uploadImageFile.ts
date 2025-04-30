import { Express } from 'express';

export interface UploadedImageFile extends Express.Multer.File {
  buffer: Buffer;
  mimetype: string;
}
