import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatsEntity } from './entities/cats.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CatsService {
    constructor(
        @InjectRepository(CatsEntity)
        private catRepo: Repository<CatsEntity>
    ) {}

    async getAllCats() {
        return await this.catRepo.find();
    }

    async createCat (dto) {
        const cat = this.catRepo.create(dto);
        return await this.catRepo.save(cat);
    }
}
