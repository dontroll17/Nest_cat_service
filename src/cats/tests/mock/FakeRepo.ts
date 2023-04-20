import { CreateCatDto } from "src/cats/dto/create-cat.dto";
import { CatsEntity } from "src/cats/entities/cats.entity";

interface Query {
    where: {
        id: string
    }
}

export class CatsRepositoryMock {
    public base = [];

    public create(dto: CreateCatDto): CatsEntity {
        return {
            id: 'uuid',
            nick: dto.nick,
            role: dto.role
        }
    }
    public async save(entity: CatsEntity): Promise<CatsEntity> {
        this.base.push(entity);
        return entity;
    }

    public async delete(id: string): Promise<void> {
        const idx = this.base.indexOf(id);
        this.base.splice(idx, 1);
    }

    public async findOne(query: Query): Promise<any> {
        const cat = this.base.find(i => i.id === query.where.id);
        return cat;
    }
}