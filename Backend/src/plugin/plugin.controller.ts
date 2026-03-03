import { Controller, Get, Res } from '@nestjs/common';
import { PluginService } from './plugin.service';
import { Response } from 'express';

@Controller('plugin')
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}

  @Get('info')
  getInfo() {
    return this.pluginService.getInfo();
  }

  @Get('download')
  async download(@Res() res: Response) {
    const fileData = await this.pluginService.getFileData();
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="springforge-plugin.zip"');
    res.send(fileData);
  }
}
