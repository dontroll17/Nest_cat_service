import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class FilesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column()
  encoding: string;

  @Column()
  size: number;
}
