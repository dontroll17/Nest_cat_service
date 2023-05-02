import { IsNotEmpty, IsString } from 'class-validator';

export class AssignTaskDto {
  @IsNotEmpty()
  @IsString()
  catNick: string;

  @IsNotEmpty()
  @IsString()
  filename: string;
}
