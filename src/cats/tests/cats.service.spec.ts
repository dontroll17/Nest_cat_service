import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from '../cats.service';
import { CatsController } from '../cats.controller';
import { CatsEntity } from '../entities/cats.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CatsRepositoryMock } from './mock/FakeRepo';
import { badCat, fakeCat } from './test-data/fakeCats';
import { fakeCatEntity } from './test-data/fakeEntity';
import { Logger } from '@nestjs/common';

describe('CatsService', () => {
  let service: CatsService;
  let mock: Repository<CatsEntity>;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: getRepositoryToken(CatsEntity),
          useClass: CatsRepositoryMock,
        },
        {
          provide: Logger,
          useValue: { log: jest.fn() },
        },
      ],
      controllers: [CatsController],
    }).compile();

    service = module.get<CatsService>(CatsService);
    mock = module.get(getRepositoryToken(CatsEntity));
    logger = module.get(Logger);
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
      const cats = await service.getAllCats();
      expect(cats).toStrictEqual([]);
    });
  });

  describe('should test add operation', () => {
    it('should add new cat', async () => {
      const newCat = await service.createCat(fakeCat);
      const data = await service.getAllCats();
      expect(newCat).toEqual(fakeCatEntity);
      expect(data).toHaveLength(1);
    });

    it('shouldn`t add new cat', async () => {
      //@ts-ignore
      const cat = await service.createCat(badCat);
      const data = await service.getAllCats();
      expect(cat).toBe(undefined);
      expect(data).toHaveLength(0);
    });
  });

  describe('should test delete operation', () => {
    it('should remove cat', async () => {
      await mock.save(fakeCatEntity);
      await service.removeCat(fakeCatEntity.id);
      //@ts-ignore
      expect(mock.base).toHaveLength(0);
    });
  });

  describe('should test change operation', () => {
    it('should change cat data', async () => {
      await mock.save(fakeCatEntity);

      const change = await service.changeCat(fakeCatEntity.id, {
        nick: 'new nick',
        role: 'new role',
        vacant: true,
        coast: 500,
      });
      expect(change).toEqual({
        id: expect.any(String),
        nick: 'new nick',
        role: 'new role',
        vacant: true,
        coast: 500,
      });
    });
  });
});
