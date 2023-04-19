import { CatsEntity } from "src/cats/entities/cats.entity";

export class CatsRepositoryMock {
    public create(dto): CatsEntity {
        return {
            id: 'string',
            nick: dto.nick,
            role: dto.role
        }
    }
    public async save(obj): Promise<CatsEntity> {
        return obj
    }
}