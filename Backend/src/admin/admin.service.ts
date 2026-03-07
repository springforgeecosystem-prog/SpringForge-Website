import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AzureStorageService } from '../storage/azure-storage.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly db: DatabaseService,
    private readonly azureStorage: AzureStorageService,
  ) {}

  async savePlugin(
    file: Express.Multer.File,
    version: string = '1.0.0',
  ): Promise<{ success: boolean; message: string }> {

    // Get old blob name so we can clean it up after
    const old = await this.db.query(
      `SELECT file_path FROM plugin_releases WHERE is_current = true LIMIT 1`,
    );

    // Upload new file to Azure Blob Storage
    const blobName = `${Date.now()}-${file.originalname}`;
    await this.azureStorage.uploadBlob(blobName, file.buffer, file.originalname);

    // Mark all previous releases as not current
    await this.db.query(`UPDATE plugin_releases SET is_current = false`);

    // Insert the new release with the blob name
    await this.db.query(
      `INSERT INTO plugin_releases (version, original_name, file_path, is_current)
       VALUES ($1, $2, $3, true)`,
      [version, file.originalname, blobName],
    );

    // Delete the old blob from Azure if it exists
    const oldBlobName = old.rows[0]?.file_path;
    if (oldBlobName) {
      await this.azureStorage.deleteBlob(oldBlobName);
    }

    return { success: true, message: `Plugin v${version} uploaded successfully.` };
  }
}
