import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatsEntity } from './entities/cats.entity';
import { Repository } from 'typeorm';
import { ChangeCatDto } from './dto/change-cat.dto';
import { CreateCatDto } from './dto/create-cat.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { FilesEntity } from '../../src/files/entities/files.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(CatsEntity)
    private catRepo: Repository<CatsEntity>,
    @InjectRepository(FilesEntity)
    private fileRepo: Repository<FilesEntity>,
  ) {}

  async getAllCats(): Promise<CatsEntity[]> {
    return await this.catRepo.find();
  }

  async getById(id): Promise<CatsEntity> {
    const cat = await this.catRepo.findOne({ where: { id } });
    if (!cat) {
      throw new HttpException('Cat not found', HttpStatus.NOT_FOUND);
    }
    return cat;
  }

  async createCat(dto: CreateCatDto): Promise<CatsEntity> {
    try {
      const cat = this.catRepo.create(dto);
      return await this.catRepo.save(cat);
    } catch (e) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  async removeCat(id: string): Promise<void> {
    const cat = await this.catRepo.delete(id);

    if (cat.affected === 0) {
      throw new HttpException('Cat not found', HttpStatus.NOT_FOUND);
    }
  }

  async changeCat(id: string, changeCatDto: ChangeCatDto): Promise<CatsEntity> {
    let cat = await this.catRepo.findOne({
      where: { id },
    });

    if (!cat) {
      throw new HttpException('Cat not found', HttpStatus.NOT_FOUND);
    }

    cat = {
      id,
      ...changeCatDto
    };

    await this.catRepo.save(cat);
    return cat;
  }

  async assignTask(dto: AssignTaskDto) {
    const cat = await this.catRepo.findOne({where: {nick: dto.catNick}});
    const file = await this.fileRepo.findOne({where: {filename: dto.filename}})
    if(!cat || !file) {
      throw new HttpException('File or cat not found', HttpStatus.NOT_FOUND);
    }

    if(!cat.job) {
      cat.job = [];
    }

    cat.job.push(file);
    return await this.catRepo.save(cat);
  }
}
