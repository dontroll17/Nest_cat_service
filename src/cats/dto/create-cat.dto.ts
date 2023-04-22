import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCatDto {
  @IsNotEmpty()
  @IsString()
  nick: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsBoolean()
  vacant: boolean;

  @IsNotEmpty()
  @IsNumber()
  coast: number;
}
