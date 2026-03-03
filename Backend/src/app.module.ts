import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PluginModule } from './plugin/plugin.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    DatabaseModule,
    PluginModule,
    AdminModule,
  ],
})
export class AppModule {}
