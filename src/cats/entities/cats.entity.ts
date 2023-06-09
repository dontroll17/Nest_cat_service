import { FilesEntity } from '../../files/entities/files.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cats')
export class CatsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  nick: string;

  @Column()
  role: string;

  @Column()
  coast: number;

  @ManyToMany(() => FilesEntity, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'task',
    joinColumn: {
      name: 'cats_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'file_id',
      referencedColumnName: 'id',
    },
  })
  job: FilesEntity[];
}
