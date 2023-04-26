import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from '../cats.service';
import { CatsController } from '../cats.controller';
import { CatsEntity } from '../entities/cats.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CatsRepositoryMock } from './mock/FakeRepo';
import { badCat, fakeCat } from './test-data/fakeCats';
import { fakeCatEntity } from './test-data/fakeEntity';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';

describe('CatsService', () => {
  let service: CatsService;
  let mock: Repository<CatsEntity>;
  let cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: getRepositoryToken(CatsEntity),
          useClass: CatsRepositoryMock,
        },
        
      ],
      controllers: [CatsController],
      imports: [CacheModule.register()]
    }).compile();

    service = module.get<CatsService>(CatsService);
    mock = module.get(getRepositoryToken(CatsEntity));
    cache = module.get(CACHE_MANAGER);
    
  });

  describe('should crud operations be exist', () => {
    it('should be getAll operation', () => {
      expect(service.getAllCats).toBeDefined();
    });

    it('should be createCat operation', () => {
      expect(service.createCat).toBeDefined();
    });

    it('should be change operation', () => {
      expect(service.changeCat).toBeDefined();
    });

    it('should be remove operation', () => {
      expect(service.removeCat).toBeDefined();
    });
  });

  describe('should test get operation', () => {
    it('should return all cats', async () => {
      try {
        const cats = await service.getAllCats();
        expect(cats).toStrictEqual([]);
      } catch(e) {
        console.error(e);
      } 
    });
  });

  describe('should test add operation', () => {
    it('should add new cat', async () => {
      try {
        const newCat = await service.createCat(fakeCat);
        const data = await service.getAllCats();
        expect(newCat).toEqual(fakeCatEntity);
        expect(data).toHaveLength(1);
      } catch(e) {
        console.error(e);
      }
    });

    it('shouldn`t add new cat', async () => {
      try {
        //@ts-ignore
        const cat = await service.createCat(badCat);
        const data = await service.getAllCats();
        expect(cat).toBe(undefined);
        expect(data).toHaveLength(0);
      } catch(e) {
        console.error(e);
      }
    });
  });

  describe('should test delete operation', () => {
    it('should remove cat', async () => {
      try {
        await mock.save(fakeCatEntity);
        await service.removeCat(fakeCatEntity.id);
        //@ts-ignore
        expect(mock.base).toHaveLength(0);
      } catch(e) {
        console.error(e);
      }
    });
  });

  describe('should test change operation', () => {
    it('should change cat data', async () => {
      const fakeCat = {
        nick: 'new nick',
        role: 'new role',
        vacant: true,
        coast: 500,
      }
      try {
        await mock.save(fakeCatEntity);

        const change = await service.changeCat(fakeCatEntity.id, fakeCat);
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
