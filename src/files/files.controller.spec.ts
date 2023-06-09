import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { Repository } from 'typeorm';
import { FilesEntity } from './entities/files.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { unlink } from 'fs/promises';

describe('FilesController', () => {
  let controller: FilesController;
  let service: FilesService;
  let repository: Repository<FilesEntity>;
  let responseMock;
  let requestMock;

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
                filename: 'image.jpg',
                deployed: 'test',
              });
            },
            delete: () => {
              return Promise.resolve({
                raw: true,
                affected: 1,
              });
            },
          },
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    service = module.get(FilesService);
    repository = module.get(getRepositoryToken(FilesEntity));

    responseMock = {
      send: jest.fn(),
      set: jest.fn((filename) => {
        return {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename=${filename.filename}`,
        };
      }),
    };

    requestMock = {
      user: {
        id: '192b78fc-926b-4813-b4f9-277e20172e90',
        login: 'test',
        password: 'some pass',
      },
    };
  });

  const fileMock = {
    filename: 'file',
    originalname: 'test-file.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('test-content'),
  };

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
      const req = await controller.upload(fileMock, requestMock);
      expect(req).toEqual({ success: 'done' });
    });

    it('should download file from server', async () => {
      const filename = { filename: 'test-file.jpg' };
      const fileStream = await controller.download(
        filename,
        responseMock,
        requestMock,
      );
      let data = '';
      const readable = fileStream.getStream().on('data', () => {});

      for await (const chunk of readable) {
        data += chunk;
      }

      expect(data).toEqual('test-content');

      await unlink('files/uuid');
    });

    it('should remove file from server', async () => {
      const req = await controller.upload(fileMock, requestMock);

      expect(req).toEqual({ success: 'done' });

      const filename = { filename: 'test-file.jpg' };
      const del = await controller.removeFIle(filename, requestMock);
      expect(del).toBeUndefined();
    });
  });
});
