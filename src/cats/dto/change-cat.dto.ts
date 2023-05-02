import { CreateCatDto } from './create-cat.dto';
import { FilesEntity } from 'src/files/entities/files.entity';

export class ChangeCatDto extends CreateCatDto {
  job: FilesEntity[];
}
