import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesEntity } from './entities/files.entity';
import { Repository } from 'typeorm';
import { writeFile } from 'fs/promises';
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
      deployed: login
    });
    if (!req) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    const filesPath = `files/${req.id}`;

    await writeFile(filesPath, file.buffer);

    return { success: 'done' };
  }

  async download(dto: FileNameDto) {
    const fileData = await this.filesRepository.findOne({where: {
      filename: dto.filename
    }});
    if(!fileData) {
      throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
    }
    return {...fileData};
  }
}
