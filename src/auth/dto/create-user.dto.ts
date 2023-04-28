import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserDto } from './user-auth.dto';

export class CreateUserDto extends UserDto {
  @IsNotEmpty()
  @IsEnum({ Admin: 'Admin', User: 'User' })
  role: 'Admin' | 'User';
}
