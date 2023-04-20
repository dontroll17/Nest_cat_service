import { CreateCatDto } from "src/cats/dto/create-cat.dto";
import { CatsEntity } from "src/cats/entities/cats.entity";

export class CatsRepositoryMock {
    public create(dto: CreateCatDto): CatsEntity {
        return {
            id: 'string',
            nick: dto.nick,
            role: dto.role
        }
    }
    public async save(entity: CatsEntity): Promise<CatsEntity> {
        return entity;
    }
}