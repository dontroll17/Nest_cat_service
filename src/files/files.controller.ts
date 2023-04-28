import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileNameDto } from './dto/file-name.dto';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { AuthGuard } from '@nestjs/passport';

@Controller('files')
export class FilesController {
  constructor(private service: FilesService) {}

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  async upload(@UploadedFile() file, @Req() req):Promise<object> {
    const login = req.user.login;
    return await this.service.upload(file, login);
  }

  @Post('download')
  async download(
    @Body() dto: FileNameDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const filename = await this.service.download(dto);
    const file = createReadStream(join('files', filename.id));
    response.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename=${filename.filename}`,
    });
    return new StreamableFile(file);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove')
  @HttpCode(204)
  async removeFIle(
    @Body() dto: FileNameDto,
    @Req() req
  ): Promise<void> {
    return await this.service.removeFile(dto, req.user.login);
  }
}
