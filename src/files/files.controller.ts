import {
  Body,
  Controller,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileNameDto } from './dto/file-name.dto';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('files')
export class FilesController {
  constructor(private service: FilesService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async upload(@UploadedFile() file) {
    return await this.service.upload(file);
  }

  @Post('download')
  async download(
    @Body() dto: FileNameDto,
    @Res({ passthrough: true }) response: Response  
  ) {
    const filename = await this.service.download(dto);
    const file = createReadStream(join('files', filename.id));
    response.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename=${filename.filename}`
    })
    return new StreamableFile(file);
  }
}
