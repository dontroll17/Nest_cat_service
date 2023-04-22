import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { AuthEntity } from './entities/auth.entitty';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthController', () => {
  let controller: AuthController;
  let mock: Repository<AuthEntity>;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(AuthEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn((user) => {
              const base = [
                { id: 'some id', login: 'cat', password: '12345678' },
              ];
              const data = base.find((i) => i.login === user.where.login);
              return data;
            }),
            create: jest.fn(() => {
              return { id: 'uuid', login: 'tester' };
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'token'),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    mock = module.get(getRepositoryToken(AuthEntity));
    jwt = module.get(JwtService);
  });

  describe('should be defined methods', () => {
    it('should be defined', () => {
      expect(controller.login).toBeDefined();
    });

    it('should be defined', () => {
      expect(controller.register).toBeDefined();
    });
  });

  describe('should test beheivor methods', () => {
    it('should test login controller', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
      const res = await controller.login({
        login: 'cat',
        password: '12345678',
      });
      expect(res).toEqual({ accessToken: expect.any(String) });
    });

    it('should test register controller', async () => {
      const res = await controller.register({
        login: 'tester',
        password: '12345678',
      });
      expect(res).toEqual({ accessToken: expect.any(String) });
    });
  });
});
