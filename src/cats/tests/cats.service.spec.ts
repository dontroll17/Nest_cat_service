import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from '../cats.service';
import { CatsController } from '../cats.controller';
import { CatsEntity } from '../entities/cats.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { fakeCat } from './test-data/fakeCat';

describe('CatsService', () => {
  let service: CatsService;
  let mock: Repository<CatsEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: getRepositoryToken(CatsEntity),
          useFactory: jest.fn()
        }
      ],
      controllers: [CatsController]
    }).compile();

    service = module.get<CatsService>(CatsService);
    mock = module.get(getRepositoryToken(CatsEntity))
  });

  describe('should crud op be exist', () => {
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

});
