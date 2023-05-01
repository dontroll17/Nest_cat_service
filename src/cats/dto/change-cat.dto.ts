import { IsNotEmpty } from 'class-validator';
import { CreateCatDto } from './create-cat.dto';

export class ChangeCatDto extends CreateCatDto {
    @IsNotEmpty()
    job: string;
}
