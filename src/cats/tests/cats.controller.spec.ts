import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from '../cats.controller';
import { CatsService } from '../cats.service';
import { CatsEntity } from '../entities/cats.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CatsRepositoryMock } from './mock/FakeRepo';
import { fakeCat } from './test-data/fakeCat';
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


  it('should create and save new cat', async () => {
    const newCat = mock.create(fakeCat);
    const data = await mock.save(newCat);

    expect(data).toEqual(fakeCatEntity);
  });

  it('should find cat', async () => {
    await mock.save(fakeCatEntity);

    const cat = await mock.findOne({
      where: { id: 'uuid' }
    });

    expect(cat).toEqual(fakeCatEntity);
  });
});
