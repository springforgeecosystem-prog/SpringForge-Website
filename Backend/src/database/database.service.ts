import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  private get dbConfig() {
    return {
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
      user: process.env.POSTGRES_USER ?? 'postgres',
      password: process.env.POSTGRES_PASSWORD ?? 'root',
    };
  }

  constructor() {
    const dbName = process.env.POSTGRES_DB ?? 'springforge_static_web';
    this.pool = new Pool({ ...this.dbConfig, database: dbName });
  }

  async onModuleInit() {
    await this.ensureDatabase();
    await this.initSchema();
  }

  private async ensureDatabase() {
    const dbName = process.env.POSTGRES_DB ?? 'springforge_static_web';

    // Connect to the default 'postgres' database to check/create our database
    const adminPool = new Pool({ ...this.dbConfig, database: 'postgres' });
    try {
      const result = await adminPool.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName],
      );
      if (result.rowCount === 0) {
        await adminPool.query(`CREATE DATABASE "${dbName}"`);
        this.logger.log(`Database "${dbName}" created`);
      }
    } finally {
      await adminPool.end();
    }
  }

  private async initSchema() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS plugin_releases (
        id            SERIAL PRIMARY KEY,
        version       VARCHAR(50)  NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_data     BYTEA        NOT NULL,
        upload_date   TIMESTAMPTZ  DEFAULT NOW(),
        is_current    BOOLEAN      DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS user_feedback (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(255),
        email      VARCHAR(255),
        message    TEXT         NOT NULL,
        rating     INTEGER      CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMPTZ  DEFAULT NOW()
      );
    `);
    this.logger.log('Database schema ready');
  }

  query(text: string, params?: any[]): Promise<any> {
    return this.pool.query(text, params);
  }
}
