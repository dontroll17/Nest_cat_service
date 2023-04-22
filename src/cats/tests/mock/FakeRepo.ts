import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateCatDto } from 'src/cats/dto/create-cat.dto';
import { CatsEntity } from 'src/cats/entities/cats.entity';

interface Query {
  where: {
    id: string;
  };
}

export class CatsRepositoryMock {
  public base = [];

  public find() {
    return this.base;
  }

  public create(dto: CreateCatDto): CatsEntity {
    return {
      id: 'uuid',
      nick: dto.nick,
      role: dto.role,
      vacant: dto.vacant,
      coast: dto.coast
    };
  }
  public async save(entity: CatsEntity): Promise<CatsEntity> {
    if (!entity.id || !entity.nick || !entity.role) {
      return;
    }
    this.base.push(entity);
    return entity;
  }

  public async delete(id: string): Promise<object> {
    const idx = this.base.indexOf(id);
    this.base.splice(idx, 1);
    return { affected: 1 };
  }

  public async findOne(query: Query): Promise<CatsEntity> {
    const cat = this.base.find((i) => i.id === query.where.id);
    return cat;
  }
}
