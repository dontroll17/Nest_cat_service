import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserDto } from './user-auth.dto';

export enum Role {
  Admin = 'Admin',
  User = 'User',
}

export class CreateUserDto extends UserDto {
  @IsNotEmpty()
  @IsEnum({ Admin: 'Admin', User: 'User' })
  role: Role;
}
