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
  let response;

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
                id: 'uuid',
                filename: entity.filename,
              });
            },
            findOne: () => {
              return Promise.resolve({
                id: 'uuid',
                filename: 'image.jpg'
              });
            }
          },
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    service = module.get(FilesService);
    repository = module.get(getRepositoryToken(FilesEntity));

    response = {
      send: jest.fn(),
      set: jest.fn((filename) => {
        return {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename=${filename.filename}`
        }
      })
    }
  });

  describe('methods should be defined', () => {
    it('upload should be defined', () => {
      expect(controller.upload).toBeDefined();
    });

    it('download should be defined', () => {
      expect(controller.download).toBeDefined();
    });
  });

  describe('call methods', () => {
    it('should save file on serve', async () => {
      const fileMock = {
        filename: 'file',
        originalname: 'test-file.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('test-content'),
      };
  
      const res = await controller.upload(fileMock);
      expect(res).toEqual({success: 'done'})
    });

    it('should download file from server', async () => {
      const filename = {filename: 'test-file.jpg'};
      const fileStream = await controller.download(filename, response);
      let data = '';
      const readable = fileStream.getStream().on('data', () => {});

      for await(const chunk of readable) {
        data += chunk
      }

      expect(data).toEqual('test-content')
    });
  });
});
