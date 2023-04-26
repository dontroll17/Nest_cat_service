import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesEntity } from './entities/files.entity';
import { Repository } from 'typeorm';
import { writeFile } from 'fs/promises';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesEntity)
    private readonly filesRepository: Repository<FilesEntity>,
  ) {}

  async upload(file) {
    console.log(file);
    const req = await this.filesRepository.save({
      filename: file.originalname,
    });
    if (!req) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    const filesPath = `files/${req.id}`;

    await writeFile(filesPath, file.buffer);

    return { success: 'done' };
  }
}
