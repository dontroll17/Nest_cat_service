import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from '../cats.controller';
import { CatsService } from '../cats.service';
import { CatsEntity } from '../entities/cats.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CatsRepositoryMock } from './mock/FakeRepo';
import { fakeCat } from './test-data/fakeCats';
import { fakeCatEntity } from './test-data/fakeEntity';

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

  describe('should crud operations be exist', () => {
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

  describe('should test controller methods', () => {
    it('should test get controller', async () => {
      const data = await controller.getAllCats();
      expect(data).toStrictEqual([]);
      expect(data).toHaveLength(0);
    });

    it('should create new cat', async () => {
      const cat = await controller.addCat(fakeCat);
      expect(cat).toEqual(fakeCatEntity);

      const data = await controller.getAllCats();
      expect(data).toHaveLength(1);
      
      const newCat = data.find(i => i.id === fakeCatEntity.id);
      expect(newCat).toBeDefined();
    });

    it('should remove cat', async () => {
      await mock.save(fakeCatEntity);

      const beforeData = await controller.getAllCats();
      expect(beforeData).toHaveLength(1);
      const cat = beforeData.find(i => i.id === fakeCatEntity.id);
      expect(cat).toBeDefined();

      await controller.removeCat(fakeCatEntity.id);
      const afterData = await controller.getAllCats();
      expect(afterData).toHaveLength(0);
    });
  });
});
