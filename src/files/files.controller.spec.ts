import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { Repository } from 'typeorm';
import { FilesEntity } from './entities/files.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('FilesController', () => {
  let controller: FilesController;
  let service: FilesService;
  let repository: Repository<FilesEntity>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        FilesService,
        {
          provide: getRepositoryToken(FilesEntity),
          useValue: {
            save: (entity) => {
              return Promise.resolve({
                id: 'some id',
                filename: entity.filename
              })
            }
          }
        }
      ]
    }).compile();

    controller = module.get<FilesController>(FilesController);
    service = module.get(FilesService);
    repository = module.get(getRepositoryToken(FilesEntity));
  });

  it('should be defined', () => {
    expect(controller.upload).toBeDefined();
  });

  it("should save file on serve", async () => {
    const fileMock = {
      filedname: 'file',
      originalname: 'test-file.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.from('test-content')
    };
    const req = await controller.upload(fileMock);
    console.log(req);
  });
});
