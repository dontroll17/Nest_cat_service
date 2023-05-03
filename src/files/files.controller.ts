import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
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
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10240 }),
          new FileTypeValidator({fileType: /\.(jpg|jpeg|png)$/})
        ],
      }),
    )
    file,
    @Req() req,
  ): Promise<object> {
    const login = req.user.login;
    return await this.service.upload(file, login);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('download')
  async download(
    @Body() dto: FileNameDto,
    @Res({ passthrough: true }) response: Response,
    @Req() req,
  ): Promise<StreamableFile> {
    const login = req.user.login;
    const filename = await this.service.download(dto, login);
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
  async removeFIle(@Body() dto: FileNameDto, @Req() req): Promise<void> {
    const login = req.user.login;
    return await this.service.removeFile(dto, login);
  }
}
