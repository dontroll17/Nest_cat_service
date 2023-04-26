import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEnum({ Admin: 'Admin', User: 'User' })
  role: 'Admin' | 'User';
}
