import { Injectable, Logger } from '@nestjs/common';
import {
  BlobServiceClient,
  BlobSASPermissions,
} from '@azure/storage-blob';

@Injectable()
export class AzureStorageService {
  private readonly logger = new Logger(AzureStorageService.name);
  private readonly blobServiceClient: BlobServiceClient;
  private readonly containerName: string;

  constructor() {
    const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.containerName =
      process.env.AZURE_STORAGE_CONTAINER_NAME ?? 'springforge-plugins';
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
  }

  async uploadBlob(blobName: string, buffer: Buffer, originalName: string): Promise<void> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    await containerClient.createIfNotExists();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: 'application/zip',
        blobContentDisposition: `attachment; filename="${originalName}"`,
      },
    });
    this.logger.log(`Uploaded blob: ${blobName}`);
  }

  async deleteBlob(blobName: string): Promise<void> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
    this.logger.log(`Deleted blob: ${blobName}`);
  }

  async generateSasUrl(blobName: string, expiryMinutes: number, downloadName?: string): Promise<string> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const expiresOn = new Date();
    expiresOn.setMinutes(expiresOn.getMinutes() + expiryMinutes);
    return blockBlobClient.generateSasUrl({
      permissions: BlobSASPermissions.parse('r'),
      expiresOn,
      contentDisposition: downloadName
        ? `attachment; filename="${downloadName}"`
        : undefined,
    });
  }
}
