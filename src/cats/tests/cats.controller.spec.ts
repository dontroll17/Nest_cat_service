import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from '../cats.controller';
import { CatsService } from '../cats.service';
import { CatsEntity } from '../entities/cats.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CatsRepositoryMock } from './mock/FakeRepo';
import { fakeCat } from './test-data/fakeCat';

describe('CatsController', () => {
  let controller: CatsController;
  let mock: Repository<CatsEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        CatsService,
        {
          provide: getRepositoryToken(CatsEntity),
          useClass: CatsRepositoryMock
        }
      ]
    }).compile();

    controller = module.get<CatsController>(CatsController);
    mock = module.get(getRepositoryToken(CatsEntity))
  });

  describe('should crud op be exist', () => {
    it('should be getAll operation', () => {
      expect(controller.getAllCats).toBeDefined();
    });

    it('should be createCat operation', () => {
      expect(controller.addCat).toBeDefined();
    });

    it('should be change operation', () => {
      expect(controller.changeCat).toBeDefined();
    });

    it('should be remove operation', () => {
      expect(controller.removeCat).toBeDefined();
    });
  });

  it('should create new cat', async () => {
    const newCat = mock.create(fakeCat);
    const data = await mock.save(newCat);

    expect(data).toEqual({id: 'string', nick: fakeCat.nick, role: fakeCat.role});
  });
});
