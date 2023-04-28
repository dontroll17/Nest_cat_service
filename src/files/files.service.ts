import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesEntity } from './entities/files.entity';
import { Repository } from 'typeorm';
import { unlink, writeFile } from 'fs/promises';
import { FileNameDto } from './dto/file-name.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesEntity)
    private readonly filesRepository: Repository<FilesEntity>,
  ) {}

  async upload(file, login) {
    const req = await this.filesRepository.save({
      filename: file.originalname,
      deployed: login,
    });
    if (!req) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    const filesPath = `files/${req.id}`;

    await writeFile(filesPath, file.buffer);

    return { success: 'done' };
  }

  async download(dto: FileNameDto) {
    const fileData = await this.filesRepository.findOne({
      where: {
        filename: dto.filename,
      },
    });
    if (!fileData) {
      throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
    }
    return { ...fileData };
  }

  async removeFile(dto: FileNameDto, login) {
    const file = await this.filesRepository.findOne({
      where: {
        filename: dto.filename,
        deployed: login
      }
    });
    if (!file) {
      throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
    }

    const del = await this.filesRepository.delete(file);
    if(del.affected === 0) {
      throw new HttpException('file not found', HttpStatus.NOT_FOUND);
    }

    await unlink(`files/${file.id}`);
  }
}
