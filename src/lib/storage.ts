import { promises as fs } from "fs";
import path from "path";

export interface StorageProvider {
  /**
   * Uploads a file and returns the accessible URL path
   */
  uploadFile(file: File, relativeDir: string): Promise<string>;
}

export class LocalStorageProvider implements StorageProvider {
  async uploadFile(file: File, relativeDir: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique name to prevent collisions
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.name) || ".png";
    const filename = `${uniqueSuffix}${fileExtension}`;

    // Target upload path: public/uploads
    const uploadDir = path.join(process.cwd(), "public", relativeDir);
    
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // Return relative public path (e.g. /uploads/12345.png)
    return `/${relativeDir}/${filename}`;
  }
}

// Currently active storage provider. Swap this instance to switch to S3/Cloudinary/etc.
export const storageProvider: StorageProvider = new LocalStorageProvider();
