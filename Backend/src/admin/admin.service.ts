import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  async savePlugin(
    file: Express.Multer.File,
    version: string = '1.0.0',
  ): Promise<{ success: boolean; message: string }> {
    
    // Mark all previous releases as not current
    await this.db.query(`UPDATE plugin_releases SET is_current = false`);

    // Insert the new release
    await this.db.query(
      `INSERT INTO plugin_releases (version, original_name, file_data, is_current)
       VALUES ($1, $2, $3, true)`,
      [version, file.originalname, file.buffer],
    );

    return { success: true, message: `Plugin v${version} uploaded successfully.` };
  }
}
