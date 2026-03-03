import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PluginService {
  constructor(private readonly db: DatabaseService) {}

  async getInfo(): Promise<{
    name: string;
    version: string;
    uploadDate: string;
    description: string;
    hasFile: boolean;
  }> {
    const result = await this.db.query(
      `SELECT version, upload_date FROM plugin_releases WHERE is_current = true LIMIT 1`,
    );
    const row = result.rows[0];
    return {
      name: 'SpringForge',
      version: row?.version ?? 'N/A',
      uploadDate: row?.upload_date ?? 'N/A',
      description: 'Intelligent Spring Boot CI/CD automation powered by Claude AI',
      hasFile: !!row,
    };
  }

  async getFileData(): Promise<Buffer> {
    const result = await this.db.query(
      `SELECT file_data FROM plugin_releases WHERE is_current = true LIMIT 1`,
    );
    if (!result.rows[0]) {
      throw new NotFoundException('No plugin file has been uploaded yet.');
    }
    return result.rows[0].file_data;
  }
}
