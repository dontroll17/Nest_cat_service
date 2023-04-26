import { IsNotEmpty, IsString } from "class-validator";

export class FileNameDto {
    @IsNotEmpty()
    @IsString()
    filename: string;
}