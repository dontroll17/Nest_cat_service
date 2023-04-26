import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from '../cats.controller';
import { CatsService } from '../cats.service';
import { CatsEntity } from '../entities/cats.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CatsRepositoryMock } from './mock/FakeRepo';
import { fakeCat } from './test-data/fakeCats';
import { fakeCatEntity } from './test-data/fakeEntity';
import { CACHE_MANAGER, CacheModule} from '@nestjs/cache-manager';

describe('CatsController', () => {
  let controller: CatsController;
  let mock: Repository<CatsEntity>;
  let cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        CatsService,
        {
          provide: getRepositoryToken(CatsEntity),
          useClass: CatsRepositoryMock,
        }
      ],
      imports: [CacheModule.register()]
    }).compile();

    controller = module.get<CatsController>(CatsController);
    mock = module.get(getRepositoryToken(CatsEntity));
    cache = module.get(CACHE_MANAGER);
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
      try {
        const data = await controller.getAllCats();
        expect(data).toStrictEqual([]);
        expect(data).toHaveLength(0);
      } catch (e) {
        console.error(e);
      }   
    });

    it('should create new cat', async () => {
      try {
        const cat = await controller.addCat(fakeCat);
        expect(cat).toEqual(fakeCatEntity);
  
        const data = await controller.getAllCats();
        expect(data).toHaveLength(1);
  
        const newCat = data.find((i) => i.id === fakeCatEntity.id);
        expect(newCat).toBeDefined();
      } catch (e) {
        console.error(e);
      }
    });

    it('should remove cat', async () => {
      try {
        await mock.save(fakeCatEntity);

        const beforeData = await controller.getAllCats();
        expect(beforeData).toHaveLength(1);
        const cat = beforeData.find((i) => i.id === fakeCatEntity.id);
        expect(cat).toBeDefined();

        await controller.removeCat(fakeCatEntity.id);
        const afterData = await controller.getAllCats();
        expect(afterData).toHaveLength(0);
      } catch (e) {
        console.error(e);
      }
    });

    it('should change cat data', async () => {
      const fakeCat = {
        nick: 'new nick',
        role: 'new role',
        vacant: true,
        coast: 500,
      }
      try {
        await mock.save(fakeCatEntity);

        const change = await controller.changeCat(fakeCatEntity.id, fakeCat );
        expect(change).toEqual({
          id: expect.any(String),
          nick: 'new nick',
          role: 'new role',
          vacant: true,
          coast: 500,
        });
      } catch(e) {
        console.error(e);
      }
    });
  });
});
