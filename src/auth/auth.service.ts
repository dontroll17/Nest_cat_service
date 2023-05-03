import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthEntity } from './entities/auth.entitty';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';
import { User } from './interface/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private auth: Repository<AuthEntity>,
    private jwtService: JwtService,
  ) {}

  async genToken(user: User) {
    const payload = { id: user.id, login: user.login, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async validateUser(dto: UserDto) {
    const user = await this.auth.findOne({ where: { login: dto.login } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const passCheck = await bcrypt.compare(dto.password, user.password);

    if (user && passCheck) {
      return {
        id: user.id,
        login: user.login,
        role: user.role,
      };
    }

    throw new UnauthorizedException({ message: 'Wrong email or password' });
  }

  async register(dto: CreateUserDto) {
    if (Object.keys(dto).length < 3) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    const user = await this.auth.findOne({ where: { login: dto.login } });
    if (user) {
      throw new HttpException('user already register', HttpStatus.CONFLICT);
    }

    const hash = await bcrypt.hash(dto.password, Number(process.env.SALT));

    const createUser = this.auth.create({
      ...dto,
      password: hash,
    });

    await this.auth.save(createUser);
    return this.genToken({
      id: createUser.id,
      login: createUser.login,
      role: createUser.role,
    });
  }

  async login(dto: UserDto) {
    if (Object.keys(dto).length < 2) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    const user = await this.validateUser(dto);
    return this.genToken(user);
  }
}
