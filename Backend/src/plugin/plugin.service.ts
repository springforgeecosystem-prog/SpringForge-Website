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

  async getFileInfo(): Promise<{ filePath: string; originalName: string }> {
    const result = await this.db.query(
      `SELECT file_path, original_name FROM plugin_releases WHERE is_current = true LIMIT 1`,
    );
    if (!result.rows[0]) {
      throw new NotFoundException('No plugin file has been uploaded yet.');
    }
    return {
      filePath: result.rows[0].file_path,
      originalName: result.rows[0].original_name,
    };
  }

  async logDownload(userId: number): Promise<void> {
    const info = await this.getInfo();
    await this.db.query(
      `INSERT INTO download_logs (user_id, version) VALUES ($1, $2)`,
      [userId, info.version],
    );
  }
}
