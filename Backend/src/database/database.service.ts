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
      ssl: process.env.POSTGRES_HOST?.includes('azure.com')
        ? { rejectUnauthorized: false }
        : undefined,
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
    // Migrate: drop old user_feedback table that lacks user_id column
    const colCheck = await this.pool.query(`
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'user_feedback' AND column_name = 'user_id'
    `);
    if (colCheck.rowCount === 0) {
      await this.pool.query(`DROP TABLE IF EXISTS user_feedback`);
      this.logger.log('Dropped legacy user_feedback table for migration');
    }

    // Migrate: swap file_data BYTEA column for file_path VARCHAR (ALTER TABLE, no drop)
    const blobColCheck = await this.pool.query(`
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'plugin_releases' AND column_name = 'file_data'
    `);
    if (blobColCheck.rowCount > 0) {
      await this.pool.query(`ALTER TABLE plugin_releases ADD COLUMN file_path VARCHAR(500)`);
      await this.pool.query(`DELETE FROM plugin_releases`); // old rows have no disk file
      await this.pool.query(`ALTER TABLE plugin_releases DROP COLUMN file_data`);
      await this.pool.query(`ALTER TABLE plugin_releases ALTER COLUMN file_path SET NOT NULL`);
      this.logger.log('Migrated plugin_releases: BYTEA → file_path (ALTER TABLE)');
    }

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            SERIAL PRIMARY KEY,
        full_name     VARCHAR(255) NOT NULL,
        email         VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        organization  VARCHAR(255),
        created_at    TIMESTAMPTZ  DEFAULT NOW(),
        last_login    TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS plugin_releases (
        id            SERIAL PRIMARY KEY,
        version       VARCHAR(50)  NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_path     VARCHAR(500) NOT NULL,
        upload_date   TIMESTAMPTZ  DEFAULT NOW(),
        is_current    BOOLEAN      DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS user_feedback (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER      NOT NULL REFERENCES users(id),
        module     VARCHAR(100),
        rating     INTEGER      NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment    TEXT         NOT NULL,
        created_at TIMESTAMPTZ  DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS download_logs (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER      NOT NULL REFERENCES users(id),
        version     VARCHAR(50),
        downloaded_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    this.logger.log('Database schema ready');
  }

  query(text: string, params?: any[]): Promise<any> {
    return this.pool.query(text, params);
  }
}
