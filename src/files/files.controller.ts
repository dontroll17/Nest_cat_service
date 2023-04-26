import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileNameDto } from './dto/file-name.dto';
import { Response } from 'express';

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
    @Res() response: Response  
  ) {
    const file = await this.service.download(dto);
    response.send(file);
  }
}
