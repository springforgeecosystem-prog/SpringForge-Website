import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AdminService } from './admin.service';
import { BasicAuthGuard } from './basic-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('upload')
  @UseGuards(BasicAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB
      fileFilter: (_req, file, callback) => {
        if (!file.originalname.match(/\.zip$/i)) {
          return callback(
            new BadRequestException('Only .zip files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadPlugin(
    @UploadedFile() file: Express.Multer.File,
    @Body('version') version: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }  
    return this.adminService.savePlugin(file, version);
  }
}
