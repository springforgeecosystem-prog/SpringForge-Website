import { Controller, Get, Res, UseGuards, Req } from '@nestjs/common';
import { PluginService } from './plugin.service';
import { AzureStorageService } from '../storage/azure-storage.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response, Request } from 'express';

@Controller('plugin')
export class PluginController {
  constructor(
    private readonly pluginService: PluginService,
    private readonly azureStorage: AzureStorageService,
  ) {}

  @Get('info')
  getInfo() {
    return this.pluginService.getInfo();
  }

  @Get('download')
  @UseGuards(JwtAuthGuard)
  async download(@Req() req: Request, @Res() res: Response) {
    const userId = (req as any).user.id;
    const { filePath: blobName, originalName } = await this.pluginService.getFileInfo();
    await this.pluginService.logDownload(userId);
    const sasUrl = await this.azureStorage.generateSasUrl(blobName, 5, originalName);
    res.json({ url: sasUrl });
  }
}
