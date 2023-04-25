import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserDto } from './dto/user-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { JWT } from './interface/jwt.interface';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  
  @HttpCode(200)
  async login(@Body() userDto: UserDto): Promise<JWT> {
    return await this.service.login(userDto);
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<JWT> {
    return await this.service.register(dto);
  }
}
